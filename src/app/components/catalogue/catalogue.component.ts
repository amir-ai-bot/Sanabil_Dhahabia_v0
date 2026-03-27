import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top: 2rem;">
      <h1 style="text-align: center; color: var(--color-green); margin-bottom: 2rem;">
        Catalogue de Produits
      </h1>

      <div class="card" style="margin-bottom: 2rem;">
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
          <div style="flex: 1; min-width: 200px;">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Rechercher un produit..."
              [(ngModel)]="searchQuery"
              (input)="onSearch()">
          </div>
          <div>
            <select class="form-control" [(ngModel)]="selectedCategoryId" (change)="filterByCategory()">
              <option [value]="0">Toutes les catégories</option>
              <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div>
            <select class="form-control" [(ngModel)]="sortBy" (change)="sortProducts()">
              <option value="name">Trier par nom</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="stock">Disponibilité</option>
            </select>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        <p>Chargement des produits...</p>
      </div>

      <div *ngIf="!loading && filteredProducts.length === 0" class="card" style="text-align: center; padding: 3rem;">
        <p style="font-size: 1.2rem;">Aucun produit trouvé.</p>
      </div>

      <div class="grid grid-3" *ngIf="!loading && filteredProducts.length > 0">
        <div class="card product-card" *ngFor="let product of filteredProducts" 
             [routerLink]="['/produit', product.id]">
          <img [src]="getStoreImageUrl(product.image)" (error)="onImageError($event)" [alt]="product.name">
          <h3>{{ product.name }}</h3>
          <p style="color: var(--color-gray); margin: 0.5rem 0; min-height: 60px;">
            {{ (product.description || '').substring(0, 100) }}...
          </p>
          <p class="price">{{ product.price | number:'1.2-2' }} TND</p>
          <span class="badge" 
                [ngClass]="product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'">
            {{ product.stock > 0 ? (product.stock + ' en stock') : 'Rupture de stock' }}
          </span>
        </div>
      </div>
    </div>
  `
})
export class CatalogueComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  searchQuery = '';
  selectedCategoryId = 0;
  sortBy = 'name';
  loading = true;
  imageCacheBuster = Date.now().toString();

  constructor(
    public productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.loading = false;
      this.bumpImageCache();

      // Check for category filter in URL
      this.route.queryParams.subscribe(params => {
        if (params['category']) {
          this.selectedCategoryId = +params['category'];
        }
        this.applyFilters();
      });
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  filterByCategory(): void {
    this.applyFilters();
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && target.src) {
      target.src = 'assets/placeholder.svg';
    }
  }

  sortProducts(): void {
    let sorted = [...this.filteredProducts];

    switch (this.sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'stock':
        sorted.sort((a, b) => b.stock - a.stock);
        break;
    }

    this.filteredProducts = sorted;
  }

  private applyFilters(): void {
    let filtered = [...this.products];

    // Apply category filter
    const categoryId = +this.selectedCategoryId; // Convert to number
    if (categoryId !== 0) {
      filtered = filtered.filter(p => p.categoryId === categoryId);
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        const pName = p.name ? p.name.toLowerCase() : '';
        const pDesc = p.description ? p.description.toLowerCase() : '';
        return pName.includes(query) || pDesc.includes(query);
      });
    }

    this.filteredProducts = filtered;
    this.sortProducts();
  }

  getStoreImageUrl(img: string | null | undefined): string {
    return this.productService.getProductImageUrl(img || '', this.imageCacheBuster);
  }

  private bumpImageCache(): void {
    this.imageCacheBuster = Date.now().toString();
  }
}
