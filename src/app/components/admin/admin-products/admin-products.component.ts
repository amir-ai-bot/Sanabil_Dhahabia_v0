import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product, Category } from '../../../models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h1 style="color: var(--color-green);">Gestion des Produits</h1>
        <div style="display: flex; gap: 1rem;">
          <a routerLink="/admin/dashboard" class="btn btn-secondary">
            Retour au tableau de bord
          </a>
          <button class="btn btn-primary" (click)="openAddForm()">
            + Ajouter un produit
          </button>
        </div>
      </div>

      <!-- Add/Edit Product Form -->
      <div class="card" *ngIf="showAddForm || editingProduct" style="margin-bottom: 2rem;">
        <h2 style="color: var(--color-green); margin-bottom: 1.5rem;">
          {{ editingProduct ? 'Modifier le produit' : 'Ajouter un produit' }}
        </h2>
        <div *ngIf="statusMessage" [style]="'padding: 1rem; border-radius: 5px; margin-bottom: 1rem; color: white; background: ' + (statusType === 'success' ? '#28a745' : '#dc3545')">
          {{ statusMessage }}
        </div>
        <form (ngSubmit)="saveProduct()">
          <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label>Nom</label>
              <input type="text" class="form-control" [(ngModel)]="productForm.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Catégorie</label>
              <select class="form-control" [(ngModel)]="productForm.categoryId" name="categoryId" required>
                <option value="">Sélectionner une catégorie</option>
                <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Prix (TND)</label>
              <input type="number" class="form-control" [(ngModel)]="productForm.price" name="price" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Stock</label>
              <input type="number" class="form-control" [(ngModel)]="productForm.stock" name="stock" required>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Description</label>
              <textarea class="form-control" [(ngModel)]="productForm.description" name="description" rows="4" required></textarea>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Image du produit</label>
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
                <p style="color: #666; font-size: 0.9rem; margin: 0;">Choisissez une image dans le dossier du serveur (public/images/products) :</p>
                <button type="button" class="btn btn-secondary" (click)="loadAvailableImages()" [disabled]="loadingImages" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">
                  {{ loadingImages ? 'Chargement…' : 'Rafraîchir la liste' }}
                </button>
              </div>
              <div *ngIf="loadingImages" style="padding: 1rem; color: #666;">Chargement des images…</div>
              <div *ngIf="!loadingImages && availableImages.length === 0" style="padding: 1rem; background: #fff3cd; border-radius: 5px; color: #856404;">Aucune image chargée. Lancez le backend dans un autre terminal : <code>npm run backend</code>, puis rafraîchissez cette page. Les images doivent être dans <code>backend/public/images/products</code>.</div>
              <div *ngIf="!loadingImages && availableImages.length > 0" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                <button type="button" *ngFor="let img of availableImages" (click)="selectImage('/images/products/' + img)"
                  [style.border]="isSelectedImage('/images/products/' + img) ? '3px solid var(--color-green)' : '1px solid #ddd'"
                  style="padding: 2px; border-radius: 8px; background: #fff; cursor: pointer;">
                  <img [src]="getAdminImageUrl('/images/products/' + img)" [alt]="img" style="width: 64px; height: 64px; object-fit: cover; border-radius: 6px; display: block;">
                </button>
              </div>
              <div *ngIf="productForm.image" style="margin-bottom: 1rem; padding: 1rem; background: #f9f9f9; border-radius: 5px;">
                <p style="font-weight: bold; margin: 0 0 0.5rem 0;">Image choisie :</p>
                <img *ngIf="imagePreviewUrl" [src]="imagePreviewUrl" alt="Aperçu" style="max-width: 200px; max-height: 200px; border-radius: 5px;" (error)="onImageError()" (load)="onImageLoad()">
                <p style="color: red; font-size: 0.9rem; margin-top: 0.5rem;" *ngIf="imageError">{{ imageErrorMessage }}</p>
              </div>
              <details style="margin-top: 0.5rem;">
                <summary style="cursor: pointer; color: var(--color-green);">Autre option : URL ou téléversement</summary>
                <div style="margin-top: 0.75rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
                  <input type="text" class="form-control" [(ngModel)]="productForm.image" name="image" (ngModelChange)="onImageUrlChange()" placeholder="URL https:// ou chemin" style="max-width: 320px;">
                  <label class="btn btn-secondary" style="margin: 0; cursor: pointer;">
                    Téléverser un fichier
                    <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" (change)="onImageFileSelect($event)" style="display: none;">
                  </label>
                  <span *ngIf="uploadingImage" style="color: #666;">Envoi…</span>
                </div>
              </details>
            </div>
          </div>
          <div style="display: flex; gap: 1rem; margin-top: 1rem;">
            <button type="submit" class="btn btn-primary" [disabled]="isLoading">
              {{ isLoading ? 'En cours...' : (editingProduct ? 'Mettre à jour' : 'Ajouter') }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="cancelEdit()" [disabled]="isLoading">
              Annuler
            </button>
          </div>
        </form>
      </div>

      <!-- Products List -->
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td>
                <img [src]="getAdminImageUrl(product.image)" [alt]="product.name" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.category?.name || 'N/A' }}</td>
              <td style="font-weight: bold; color: var(--color-gold);">
                {{ product.price | number:'1.2-2' }} TND
              </td>
              <td>
                <span class="badge" 
                      [ngClass]="product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'">
                  {{ product.stock }}
                </span>
              </td>
              <td>
                <button class="btn btn-secondary" (click)="editProduct(product)" style="margin-right: 0.5rem; padding: 0.3rem 0.8rem;">
                  Modifier
                </button>
                <button class="btn btn-danger" (click)="deleteProduct(product.id)" style="padding: 0.3rem 0.8rem;">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminProductsComponent implements OnInit {
  /** Matches a URL in text (e.g. "Caption: https://example.com/photo.jpg") */
  private readonly URL_IN_TEXT = /https?:\/\/[^\s<>"']+/i;
  /** Page URLs that return HTML, not a direct image */
  private readonly PAGE_URL_PATTERNS = [
    /pexels\.com\/[^/]+\/photo\//i,
    /unsplash\.com\/photos\//i,
    /unsplash\.com\/[^/]+\/photo\//i,
  ];
  products: Product[] = [];
  categories: Category[] = [];
  showAddForm = false;
  editingProduct: Product | null = null;
  imageError = false;
  imageErrorMessage = 'Image invalide ou inaccessible';
  /** URL used for preview (extracted from field or local path + base) */
  imagePreviewUrl = '';
  uploadingImage = false;
  imageBaseUrl = '';
  imageCacheBuster = '';
  /** Images from backend public/images/products for the picker */
  availableImages: string[] = [];
  loadingImages = false;
  isLoading = false;
  statusMessage = '';
  statusType: 'success' | 'error' | '' = '';
  productForm = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    categoryId: 0
  };

  constructor(public productService: ProductService) {}

  ngOnInit(): void {
    this.imageBaseUrl = this.productService.getImageBaseUrl();
    this.bumpImageCache();
    this.loadProducts();
    this.loadCategories();
  }

  openAddForm(): void {
    this.showAddForm = true;
    this.editingProduct = null;
    this.productForm = { name: '', description: '', price: 0, stock: 0, image: '', categoryId: 0 };
    this.bumpImageCache();
    this.loadAvailableImages();
  }

  loadAvailableImages(): void {
    this.loadingImages = true;
    this.productService.getProductImagesList().subscribe({
      next: (list) => {
        this.availableImages = list || [];
        this.bumpImageCache();
        this.loadingImages = false;
      },
      error: () => {
        this.availableImages = [];
        this.bumpImageCache();
        this.loadingImages = false;
      }
    });
  }

  selectImage(path: string): void {
    this.productForm.image = path;
    this.imageError = false;
    this.onImageUrlChange();
  }

  isSelectedImage(path: string): boolean {
    const current = (this.productForm.image || '').trim();
    return current === path || current === path.replace(/^\/images\/products\//, '');
  }

  onImageFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    this.uploadingImage = true;
    this.imageError = false;
    this.productService.uploadImage(file).subscribe({
      next: (res) => {
        this.productForm.image = res.path;
        this.bumpImageCache();
        this.onImageUrlChange();
        this.uploadingImage = false;
        input.value = '';
      },
      error: (err) => {
        this.imageError = true;
        this.imageErrorMessage = (err?.error?.message || err?.message || 'Échec du téléversement (vérifiez que le backend est démarré, ex. XAMPP). Vous pouvez entrer un chemin : /images/products/nom.jpg');
        this.uploadingImage = false;
        input.value = '';
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.bumpImageCache();
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image ?? '',
      categoryId: product.categoryId
    };
    this.showAddForm = true;
    this.bumpImageCache();
    this.loadAvailableImages();
    this.onImageUrlChange();
  }

  cancelEdit(): void {
    this.showAddForm = false;
    this.editingProduct = null;
    this.imageError = false;
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      image: '',
      categoryId: 0
    };
  }

  saveProduct(): void {
    // Validation
    if (!this.productForm.name.trim()) {
      this.showStatus('Veuillez entrer un nom de produit', 'error');
      return;
    }
    if (!this.productForm.description.trim()) {
      this.showStatus('Veuillez entrer une description', 'error');
      return;
    }
    if (this.productForm.price <= 0) {
      this.showStatus('Le prix doit être supérieur à 0', 'error');
      return;
    }
    if (this.productForm.stock < 0) {
      this.showStatus('Le stock ne peut pas être négatif', 'error');
      return;
    }
    const imageUrl = this.getEffectiveImageUrl();
    if (!imageUrl) {
      this.showStatus('Veuillez entrer une URL d\'image (https://...) ou un chemin (/images/products/nom.jpg).', 'error');
      return;
    }
    if (this.imageError) {
      this.showStatus('Utilisez l\'URL directe de l\'image, pas le lien de la page Pexels/Unsplash.', 'error');
      return;
    }
    if (this.productForm.categoryId === 0) {
      this.showStatus('Veuillez sélectionner une catégorie', 'error');
      return;
    }

    this.isLoading = true;
    this.statusMessage = '';

    const payload = { ...this.productForm, image: imageUrl };
    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.id, payload).subscribe({
        next: () => {
          this.showStatus('Produit mis à jour avec succès', 'success');
          setTimeout(() => {
            this.loadProducts();
            this.cancelEdit();
          }, 1500);
        },
        error: (err: any) => {
          console.error('Erreur updateProduct:', err);
          this.showStatus('Erreur: ' + (err.message || 'Mise à jour échouée'), 'error');
          this.isLoading = false;
        }
      });
    } else {
      this.productService.createProduct(payload as any).subscribe({
        next: () => {
          this.showStatus('Produit créé avec succès', 'success');
          setTimeout(() => {
            this.loadProducts();
            this.cancelEdit();
          }, 1500);
        },
        error: (err: any) => {
          console.error('Erreur createProduct:', err);
          this.showStatus('Erreur: ' + (err.message || 'Création échouée'), 'error');
          this.isLoading = false;
        }
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err: any) => {
          alert('Erreur lors de la suppression: ' + err.message);
        }
      });
    }
  }

  /** Extract first URL from field; use for preview and save. */
  getEffectiveImageUrl(): string {
    const raw = (this.productForm.image || '').trim();
    const match = raw.match(this.URL_IN_TEXT);
    if (match) return match[0].replace(/[.,;:!?)]+$/, '').trim();
    return raw;
  }

  /** Detect if URL is a Pexels/Unsplash page (HTML), not a direct image. */
  isPageUrl(url: string): boolean {
    return this.PAGE_URL_PATTERNS.some((re: RegExp) => re.test(url));
  }

  onImageUrlChange(): void {
    this.imageError = false;
    const raw = (this.productForm.image || '').trim();
    // Use same URL as product list so images from backend public/images/products load
    if (raw.startsWith('/')) {
      this.imagePreviewUrl = this.productService.getProductImageUrl(raw, this.imageCacheBuster);
    } else {
      this.imagePreviewUrl = this.getEffectiveImageUrl() || '';
      if (this.imagePreviewUrl && this.isPageUrl(this.imagePreviewUrl)) {
        this.imageError = true;
        this.imageErrorMessage =
          'Cette URL est une page Pexels/Unsplash, pas l\'image. Utilisez le lien direct ou téléversez un fichier local.';
      }
    }
  }

  onImageError(): void {
    this.imageError = true;
    if (this.imagePreviewUrl && this.isPageUrl(this.imagePreviewUrl)) {
      this.imageErrorMessage =
        'Cette URL est une page Pexels/Unsplash, pas l\'image. Utilisez le lien direct : clic droit sur l\'image → « Copier l\'adresse de l\'image ».';
    } else {
      this.imageErrorMessage = 'Image invalide ou inaccessible. Vérifiez que l\'URL pointe directement vers un fichier image (.jpg, .png, etc.).';
    }
  }

  onImageLoad(): void {
    this.imageError = false;
  }

  getAdminImageUrl(img: string | null | undefined): string {
    return this.productService.getProductImageUrl(img || '', this.imageCacheBuster);
  }

  private bumpImageCache(): void {
    this.imageCacheBuster = Date.now().toString();
  }

  private showStatus(message: string, type: 'success' | 'error'): void {
    this.statusMessage = message;
    this.statusType = type;
    if (type === 'success') {
      this.isLoading = false;
    }
    setTimeout(() => {
      if (this.statusType === type) {
        this.statusMessage = '';
        this.statusType = '';
      }
    }, 5000);
  }
}
