import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="hero">
      <h1>Bienvenue chez SANABEL DHAHABIA</h1>
      <p>Votre partenaire de confiance pour tous vos besoins en matériel agricole</p>
      <a routerLink="/catalogue" class="btn btn-primary">Découvrir notre catalogue</a>
    </div>

    <div class="container">
      <section style="margin: 4rem 0;">
        <h2 style="text-align: center; color: var(--color-green); margin-bottom: 2rem; font-size: 2.5rem;">
          Qui sommes-nous ?
        </h2>
        <div class="card" style="max-width: 800px; margin: 0 auto; text-align: center;">
          <p style="font-size: 1.1rem; line-height: 1.8;">
            SANABEL DHAHABIA est votre spécialiste en matériel agricole de qualité. 
            Depuis plus de 20 ans, nous accompagnons les agriculteurs et exploitants 
            dans leur quête d'excellence. De la semence au matériel, nous proposons 
            une gamme complète de produits sélectionnés avec soin pour garantir 
            vos récoltes et votre réussite.
          </p>
        </div>
      </section>

      <section style="margin: 4rem 0;">
        <h2 style="text-align: center; color: var(--color-green); margin-bottom: 2rem; font-size: 2.5rem;">
          Nos Catégories
        </h2>
        <div class="grid grid-4">
          <div class="card product-card" *ngFor="let category of categories" 
               [routerLink]="['/catalogue']" 
               [queryParams]="{category: category.id}"
               style="cursor: pointer;">
            <h3>{{ category.name }}</h3>
            <p *ngIf="category.description">{{ category.description }}</p>
          </div>
        </div>
      </section>

      <section style="margin: 4rem 0;">
        <h2 style="text-align: center; color: var(--color-green); margin-bottom: 2rem; font-size: 2.5rem;">
          Produits en vedette
        </h2>
        <div class="grid grid-3">
          <div class="card product-card" *ngFor="let product of featuredProducts" 
               [routerLink]="['/produit', product.id]">
            <img [src]="getStoreImageUrl(product.image)" [alt]="product.name">
            <h3>{{ product.name }}</h3>
            <p class="price">{{ product.price | number:'1.2-2' }} TND</p>
            <span class="badge" [ngClass]="product.stock > 10 ? 'badge-success' : 'badge-warning'">
              {{ product.stock > 0 ? 'En stock' : 'Rupture de stock' }}
            </span>
          </div>
        </div>
      </section>

      <section style="margin: 4rem 0;">
        <h2 style="text-align: center; color: var(--color-green); margin-bottom: 2rem; font-size: 2.5rem;">
          Chiffres clés
        </h2>
        <div class="grid grid-4" style="text-align: center;">
          <div class="card">
            <h3 style="color: var(--color-gold); font-size: 3rem; margin-bottom: 0.5rem;">{{ productCount }}+</h3>
            <p style="font-size: 1.2rem; color: var(--color-green);">Produits</p>
          </div>
          <div class="card">
            <h3 style="color: var(--color-gold); font-size: 3rem; margin-bottom: 0.5rem;">20+</h3>
            <p style="font-size: 1.2rem; color: var(--color-green);">Années d'expérience</p>
          </div>
          <div class="card">
            <h3 style="color: var(--color-gold); font-size: 3rem; margin-bottom: 0.5rem;">5000+</h3>
            <p style="font-size: 1.2rem; color: var(--color-green);">Clients satisfaits</p>
          </div>
          <div class="card">
            <h3 style="color: var(--color-gold); font-size: 3rem; margin-bottom: 0.5rem;">4</h3>
            <p style="font-size: 1.2rem; color: var(--color-green);">Catégories</p>
          </div>
        </div>
      </section>

      <section style="margin: 4rem 0;">
        <h2 style="text-align: center; color: var(--color-green); margin-bottom: 2rem; font-size: 2.5rem;">
          Témoignages clients
        </h2>
        <div class="grid grid-3">
          <div class="card">
            <p style="font-style: italic; margin-bottom: 1rem;">
              "Service exceptionnel et produits de qualité supérieure. 
              SANABEL DHAHABIA est devenu notre fournisseur de référence."
            </p>
            <p style="font-weight: bold; color: var(--color-gold);">
              - Ahmed Benali, Agriculteur
            </p>
          </div>
          <div class="card">
            <p style="font-style: italic; margin-bottom: 1rem;">
              "Des semences de première qualité qui ont transformé nos récoltes. 
              Je recommande vivement !"
            </p>
            <p style="font-weight: bold; color: var(--color-gold);">
              - Fatima Alaoui, Exploitante
            </p>
          </div>
          <div class="card">
            <p style="font-style: italic; margin-bottom: 1rem;">
              "Équipe professionnelle et à l'écoute. 
              Leur expertise nous a fait gagner du temps et de l'argent."
            </p>
            <p style="font-weight: bold; color: var(--color-gold);">
              - Mohammed El Amrani, Directeur d'exploitation
            </p>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  productCount = 0;
  imageCacheBuster = Date.now().toString();

  constructor(public productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    this.productService.getProducts().subscribe(products => {
      this.productCount = products.length;
      this.featuredProducts = products.slice(0, 3);
      this.bumpImageCache();
    });
  }

  getStoreImageUrl(img: string | null | undefined): string {
    return this.productService.getProductImageUrl(img || '', this.imageCacheBuster);
  }

  private bumpImageCache(): void {
    this.imageCacheBuster = Date.now().toString();
  }
}
