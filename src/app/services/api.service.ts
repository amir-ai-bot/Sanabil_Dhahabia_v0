import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserRole, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Adresse du backend PHP fournie par l'environnement
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Authentification
  login(credentials: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth.php?action=login`, credentials);
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth.php?action=register`, data);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth.php?action=logout`, {});
  }

  // Produits
  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products.php`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories.php`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/products.php?id=${id}`);
  }

  createProduct(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products.php`, data);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products.php?id=${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products.php?id=${id}`);
  }

  /** Upload image file; returns { success, path: '/images/products/...' } */
  uploadImage(file: File): Observable<{ success: boolean; path?: string; message?: string }> {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<{ success: boolean; path?: string; message?: string }>(`${this.apiUrl}/upload.php`, form);
  }

  /** Base URL for serving local images (e.g. /images/products/...) */
  getImageBaseUrl(): string {
    return this.apiUrl.replace(/\/api\/?$/, '');
  }

  /** List image filenames in backend public/images/products for the picker */
  getProductImagesList(): Observable<{ success: boolean; data: string[] }> {
    const t = Date.now();
    return this.http.get<{ success: boolean; data: string[] }>(`${this.apiUrl}/list-images.php?t=${t}`);
  }

  // Commandes
  createOrder(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders.php`, data);
  }

  getUserOrders(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders.php?userId=${userId}`);
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders.php?id=${id}`);
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders.php?id=${id}&action=status`, { status });
  }

  getAllOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders.php`);
  }

  // Panier
  getCart(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart.php?action=get&userId=${userId}`);
  }

  addToCart(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart.php?action=add`, data);
  }

  clearCart(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart.php?action=clear&userId=${userId}`, {});
  }

  removeFromCart(cartItemId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart.php?action=remove`, { cartItemId });
  }

  updateCartQuantity(cartItemId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart.php?action=update`, { cartItemId, quantity });
  }
}
