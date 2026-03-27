import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { ApiService } from './api.service';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private api: ApiService, private imageService: ImageService) {}

  getCategories(): Observable<Category[]> {
    return this.api.getCategories().pipe(
      map((res: any) => res.data || []),
      catchError(() => {
        console.log('API not available, using mock categories');
        return of(this.getMockCategories());
      })
    );
  }

  getProducts(): Observable<Product[]> {
    return this.api.getAllProducts().pipe(
      map((res: any) => res.data || []),
      catchError(() => {
        // Return mock data when API fails
        console.log('API not available, using mock products');
        return of(this.getMockProducts());
      })
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.api.getProductById(id).pipe(map((res: any) => (res.data ? res.data : undefined)));
  }

  // Admin actions
  createProduct(data: any): Observable<any> {
    return this.api.createProduct(data).pipe(map((res: any) => res));
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.api.updateProduct(id, data).pipe(map((res: any) => res));
  }

  deleteProduct(id: number): Observable<any> {
    return this.api.deleteProduct(id).pipe(map((res: any) => res));
  }

  /** Upload image to local storage; returns path to store in product.image */
  uploadImage(file: File): Observable<{ path: string }> {
    return this.api.uploadImage(file).pipe(
      map((res: any) => {
        if (!res.success || !res.path) throw new Error(res.message || 'Upload échoué');
        return { path: res.path };
      })
    );
  }

  getImageBaseUrl(): string {
    return this.api.getImageBaseUrl();
  }

  /** List image filenames in backend public/images/products (for admin picker) */
  getProductImagesList(): Observable<string[]> {
    return this.api.getProductImagesList().pipe(
      map((res: any) => (res.success && Array.isArray(res.data) ? res.data : []))
    );
  }

  /** Full URL for product image (local path /images/... or external https://) */
  getProductImageUrl(img: string | null | undefined, cacheBust = ''): string {
    const url = this.imageService.getImageUrl(img);
    return this.appendCacheBust(url, cacheBust);
  }

  private appendCacheBust(url: string, cacheBust: string): string {
    if (!cacheBust) return url;
    return url + (url.includes('?') ? '&' : '?') + 'v=' + encodeURIComponent(cacheBust);
  }

  // Decrease stock asynchronously (fire-and-forget) to match previous sync usage
  decreaseStock(productId: number, quantity: number): void {
    this.getProductById(productId).pipe(
      switchMap((product) => {
        if (!product) return of(null);
        const newStock = (product.stock || 0) - quantity;
        const payload = { ...product, stock: newStock };
        return this.updateProduct(productId, payload);
      }),
      catchError(err => {
        console.error('Erreur decreaseStock:', err);
        return of(null);
      })
    ).subscribe();
  }

  // Basic server-side search / filter
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.getProducts().pipe(map(products => products.filter(p => p.categoryId === categoryId)));
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.getProducts().pipe(map(products => products.filter(p => {
      const q = query.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    })));
  }

  private getMockProducts(): Product[] {
    return [
      {
        id: 1,
        name: 'Tracteur John Deere 5100',
        description: 'Tracteur puissant 100 ch avec cabine climatisée et direction hydraulique',
        price: 85000.0,
        stock: 5,
        image: '/images/products/tractor1.jpg',
        categoryId: 1
      },
      {
        id: 2,
        name: 'Tracteur KUBOTA L3200',
        description: 'Tracteur compact 32 ch, parfait pour petites exploitations',
        price: 28000.0,
        stock: 8,
        image: '/images/products/tractor2.jpg',
        categoryId: 1
      },
      {
        id: 3,
        name: 'Moissonneuse CLAAS Lexion 650',
        description: 'Moissonneuse batteuse ultra-moderne avec capteurs',
        price: 185000.0,
        stock: 2,
        image: '/images/products/harvester1.jpg',
        categoryId: 2
      },
      {
        id: 4,
        name: 'Charrue 4 socs réversible',
        description: 'Charrue réversible de qualité pour tous types de sols',
        price: 8500.0,
        stock: 12,
        image: '/images/products/plow1.jpg',
        categoryId: 3
      },
      {
        id: 5,
        name: 'Pelle à grain métallique',
        description: 'Pelle à grain robuste en acier inoxydable',
        price: 450.0,
        stock: 80,
        image: '/images/products/shovel1.jpg',
        categoryId: 4
      }
    ];
  }

  private getMockCategories(): Category[] {
    return [
      { id: 1, name: 'Tracteurs', description: 'Tracteurs agricoles de toutes puissances' },
      { id: 2, name: 'Moissonneuses', description: 'Moissonneuses et batteuses' },
      { id: 3, name: 'Équipements de Labour', description: 'Outils pour le travail du sol' },
      { id: 4, name: 'Outils Agricoles', description: 'Outils manuels et accessoires' },
      { id: 5, name: 'Accessoires et Pièces', description: 'Pièces détachées et accessoires' }
    ];
  }
}
