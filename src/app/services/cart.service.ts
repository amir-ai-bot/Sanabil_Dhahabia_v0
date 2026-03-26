import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor(private apiService: ApiService) {
    // Load cart from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        this.cartSubject.next(JSON.parse(storedCart));
      } catch (e) {
        console.error('Erreur parsing panier local:', e);
        localStorage.removeItem('cart');
        this.cartSubject.next([]);
      }
    }
  }

  // Load cart from backend for a given user and replace local cart
  loadCartFromServer(userId: number): void {
    this.apiService.getCart(userId).subscribe({
      next: (res: any) => {
        const items = res.data || [];
        const cartItems = items.map((it: any) => {
          return {
            product: {
              id: it.productId,
              name: it.name || '',
              description: it.description || '',
              price: parseFloat(it.price) || 0,
              stock: parseInt(it.stock) || 0,
              image: it.image || '',
              categoryId: it.categoryId || 0
            },
            quantity: parseInt(it.quantity) || 1
          };
        });
        this.updateCart(cartItems);
      },
      error: (err) => {
        console.error('Erreur récupération panier serveur:', err);
      }
    });
  }

  addToCart(product: Product, quantity: number = 1): boolean {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.find(item => item.product.id === product.id);
    // Prevent adding more than available stock
    const totalRequested = (existingItem ? existingItem.quantity : 0) + quantity;
    if (totalRequested > product.stock) {
      alert('La quantité demandée dépasse le stock disponible.');
      return false;
    }
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({ product, quantity });
    }
    this.updateCart(currentCart);
    return true;
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value.filter(item => item.product.id !== productId);
    this.updateCart(currentCart);
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart.find(item => item.product.id === productId);
    if (item && quantity > item.product.stock) {
      alert('La quantité demandée dépasse le stock disponible.');
      return;
    }
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    if (item) {
      item.quantity = quantity;
      this.updateCart(currentCart);
    }
  }

  clearCart(): void {
    this.updateCart([]);
  }

  // Synchroniser le vidage du panier avec le backend
  clearCartWithBackend(userId: number): Observable<any> {
    return new Observable(observer => {
      this.apiService.clearCart(userId).subscribe({
        next: (response) => {
          this.updateCart([]);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          console.error('Erreur lors du vidage du panier au serveur:', error);
          // Même en cas d'erreur, on vide le local
          this.updateCart([]);
          observer.next({
            success: true,
            message: 'Panier vidé localement (sync serveur échouée)'
          });
          observer.complete();
        }
      });
    });
  }

  getCartTotal(): number {
    return this.cartSubject.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  getCartItemCount(): number {
    return this.cartSubject.value.reduce((count, item) => count + item.quantity, 0);
  }

  private updateCart(cart: CartItem[]): void {
    this.cartSubject.next(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  getCart(): CartItem[] {
    return this.cartSubject.value;
  }
}