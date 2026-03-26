import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../models/order.model';
import { CartItem } from '../models/cart.model';
import { ApiService } from './api.service';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private apiService: ApiService) {}

  // Créer une commande
  createOrder(
    userId: number,
    cartItems: CartItem[],
    shippingInfo: {
      address: string;
      city: string;
      postalCode: string;
      phone: string;
      deliveryDistance?: number;
      shippingCost?: number;
    }
  ): Observable<Order> {
    const orderData = {
      userId,
      items: cartItems,
      shippingInfo
    };

    return this.apiService.createOrder(orderData).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message);
      }),
      catchError(error => {
        console.error('Erreur lors de la création de la commande:', error);
        throw error;
      })
    );
  }

  // Récupérer les commandes d'un utilisateur
  getUserOrders(userId: number): Observable<Order[]> {
    return this.apiService.getUserOrders(userId).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return [];
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des commandes:', error);
        return of([]);
      })
    );
  }

  // Récupérer une commande spécifique
  getOrderById(id: number): Observable<Order> {
    return this.apiService.getOrderById(id).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error('Commande non trouvée');
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération de la commande:', error);
        throw error;
      })
    );
  }

  // Mettre à jour le statut d'une commande
  updateOrderStatus(id: number, status: OrderStatus): Observable<any> {
    return this.apiService.updateOrderStatus(id, status).pipe(
      tap(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw error;
      })
    );
  }
}
