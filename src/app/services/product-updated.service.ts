import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private apiService: ApiService) {}

  // Récupérer tous les produits
  getAllProducts(): Observable<Product[]> {
    return this.apiService.getAllProducts().pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return [];
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des produits:', error);
        return of([]);
      })
    );
  }

  // Récupérer un produit par ID
  getProductById(id: number): Observable<Product> {
    return this.apiService.getProductById(id).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error('Produit non trouvé');
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération du produit:', error);
        throw error;
      })
    );
  }

  // Créer un produit (admin)
  createProduct(data: any): Observable<any> {
    return this.apiService.createProduct(data).pipe(
      tap(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la création du produit:', error);
        throw error;
      })
    );
  }

  // Mettre à jour un produit
  updateProduct(id: number, data: any): Observable<any> {
    return this.apiService.updateProduct(id, data).pipe(
      tap(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la mise à jour du produit:', error);
        throw error;
      })
    );
  }

  // Supprimer un produit
  deleteProduct(id: number): Observable<any> {
    return this.apiService.deleteProduct(id).pipe(
      tap(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la suppression du produit:', error);
        throw error;
      })
    );
  }
}
