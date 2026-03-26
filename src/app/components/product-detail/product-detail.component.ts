import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top: 2rem;">
      <a routerLink="/catalogue" style="color: var(--color-green); text-decoration: none; margin-bottom: 1rem; display: inline-block;">
        ← Retour au catalogue
      </a>

      <div *ngIf="loading" class="loading">
        <p>Chargement du produit...</p>
      </div>

      <div *ngIf="!loading && product" class="grid" style="grid-template-columns: 1fr 1fr; gap: 3rem; margin-top: 2rem;">
        <div>
          <img [src]="getStoreImageUrl(product.image)" [alt]="product.name" 
               style="width: 100%; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        </div>
        <div class="card">
          <h1 style="color: var(--color-green); margin-bottom: 1rem;">{{ product.name }}</h1>
          <p class="price" style="font-size: 2rem; margin-bottom: 1rem;">
            {{ product.price | number:'1.2-2' }} TND
          </p>
          <div style="margin-bottom: 1.5rem;">
            <span class="badge" 
                  [ngClass]="product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'"
                  style="font-size: 1rem; padding: 0.5rem 1rem;">
              {{ product.stock > 0 ? (product.stock + ' unités en stock') : 'Rupture de stock' }}
            </span>
          </div>
          <p style="color: var(--color-gray); line-height: 1.8; margin-bottom: 2rem;">
            {{ product.description }}
          </p>
          <div *ngIf="product.category" style="margin-bottom: 1.5rem;">
            <strong>Catégorie:</strong> {{ product.category.name }}
          </div>
          
          <div *ngIf="product.stock > 0" style="margin-bottom: 1.5rem;">
            <label for="quantity" style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
              Quantité:
            </label>
            <input 
              type="number" 
              id="quantity"
              class="form-control" 
              [(ngModel)]="quantity"
              min="1"
              [max]="product.stock"
              style="width: 100px; display: inline-block; margin-right: 1rem;">
          </div>

          <div style="display: flex; gap: 1rem;">
            <button 
              class="btn btn-primary" 
              (click)="addToCart()"
              [disabled]="product.stock === 0"
              style="flex: 1; font-size: 1.1rem; padding: 1rem;">
              {{ product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock' }}
            </button>
            <button 
              class="btn btn-secondary" 
              routerLink="/catalogue"
              style="padding: 1rem;">
              Continuer les achats
            </button>
          </div>

          <div *ngIf="addedToCart" class="alert alert-success" style="margin-top: 1rem;">
            Produit ajouté au panier avec succès !
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !product" class="card" style="text-align: center; padding: 3rem;">
        <p style="font-size: 1.2rem;">Produit non trouvé.</p>
        <a routerLink="/catalogue" class="btn btn-primary" style="margin-top: 1rem;">
          Retour au catalogue
        </a>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  loading = true;
  quantity = 1;
  addedToCart = false;
  imageCacheBuster = Date.now().toString();

  constructor(
    public productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(+id).subscribe(product => {
        this.product = product;
        this.loading = false;
        this.bumpImageCache();
      });
    }
  }

  addToCart(): void {
    if (this.product) {
      const success = this.cartService.addToCart(this.product, this.quantity);
      if (success) {
        this.addedToCart = true;
        setTimeout(() => {
          this.addedToCart = false;
        }, 3000);
      }
    }
  }

  getStoreImageUrl(img: string | null | undefined): string {
    return this.productService.getProductImageUrl(img || '', this.imageCacheBuster);
  }

  private bumpImageCache(): void {
    this.imageCacheBuster = Date.now().toString();
  }
}
