import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Service de communication avec l'API PHP
 * Centralise toutes les requêtes HTTP vers le backend
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log('API Service initialisé avec URL:', this.apiUrl);
  }

  /**
   * Gestion centralisée des erreurs HTTP
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Erreur HTTP:', error);
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      return throwError(() => new Error(`Erreur: ${error.error.message}`));
    } else {
      // Erreur côté serveur
      const errorMsg = error.error?.message || `Erreur serveur: ${error.status}`;
      return throwError(() => new Error(errorMsg));
    }
  }

  // ==========================================
  // AUTHENTIFICATION
  // ==========================================

  /**
   * Connexion utilisateur
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth.php?action=login`, credentials)
      .pipe(catchError(this.handleError));
  }

  /**
   * Inscription nouvel utilisateur
   */
  register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth.php?action=register`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Déconnexion
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth.php?action=logout`, {})
      .pipe(catchError(this.handleError));
  }

  // ==========================================
  // PRODUITS
  // ==========================================

  /**
   * Récupérer tous les produits
   */
  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products.php`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Récupérer un produit par ID
   */
  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/products.php?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Créer un nouveau produit (admin)
   */
  createProduct(data: {
    name: string;
    description: string;
    price: number;
    categoryId?: number;
    stock?: number;
    image?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/products.php`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Mettre à jour un produit (admin)
   */
  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products.php?id=${id}`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Supprimer un produit (admin)
   */
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products.php?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  // ==========================================
  // COMMANDES
  // ==========================================

  /**
   * Créer une nouvelle commande
   */
  createOrder(data: {
    userId: number;
    items: any[];
    shippingInfo: {
      address: string;
      city: string;
      postalCode: string;
      phone: string;
      deliveryDistance?: number;
      shippingCost?: number;
    };
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders.php`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Récupérer les commandes d'un utilisateur
   */
  getUserOrders(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders.php?userId=${userId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Récupérer une commande spécifique
   */
  getOrderById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders.php?id=${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Mettre à jour le statut d'une commande (admin)
   */
  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/orders.php?id=${id}&action=status`,
      { status }
    ).pipe(catchError(this.handleError));
  }

  // ==========================================
  // UTILITAIRES
  // ==========================================

  /**
   * Vérifier la connexion au serveur PHP
   */
  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/../index.php`)
      .pipe(catchError(() => throwError(() => new Error('Serveur PHP indisponible'))));
  }

  /**
   * Obtenir l'URL de base de l'API
   */
  getApiUrl(): string {
    return this.apiUrl;
  }
}
