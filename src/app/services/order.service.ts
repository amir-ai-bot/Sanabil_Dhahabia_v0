import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Order, OrderStatus, OrderItem } from '../models/order.model';
import { CartItem } from '../models/cart.model';
import { ProductService } from './product.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];
  private orderItems: OrderItem[] = [];
  private orderCounter = 1;

  constructor(
    private productService: ProductService,
    private api: ApiService
  ) {}

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
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) + (shippingInfo.shippingCost || 0);

    const orderNumber = `CMD-${Date.now()}-${this.orderCounter++}`;

    const newOrder: Order = {
      id: this.orders.length + 1,
      userId,
      orderNumber,
      status: OrderStatus.PENDING,
      totalAmount,
      shippingAddress: shippingInfo.address,
      shippingCity: shippingInfo.city,
      shippingPostalCode: shippingInfo.postalCode,
      shippingPhone: shippingInfo.phone,
      deliveryDistance: shippingInfo.deliveryDistance,
      shippingCost: shippingInfo.shippingCost,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.orders.push(newOrder);

    // Create order items and decrease stock
    cartItems.forEach(item => {
      const orderItem: OrderItem = {
        id: this.orderItems.length + 1,
        orderId: newOrder.id,
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      };
      this.orderItems.push(orderItem);
      // Decrease stock when order is created
      this.productService.decreaseStock(item.product.id, item.quantity);
    });

    return of({
      ...newOrder,
      items: this.orderItems.filter(oi => oi.orderId === newOrder.id)
    });
  }

  getOrdersByUser(userId: number): Observable<Order[]> {
    const userOrders = this.orders.filter(o => o.userId === userId);
    return of(
      userOrders.map(order => ({
        ...order,
        items: this.orderItems.filter(oi => oi.orderId === order.id)
      }))
    );
  }

  getAllOrders(): Observable<Order[]> {
    return this.api.getAllOrders().pipe(
      map((res: any) => res.success && res.data ? res.data : []),
      catchError(() => of([]))
    );
  }

  getOrderById(id: number): Observable<Order | undefined> {
    const order = this.orders.find(o => o.id === id);
    if (order) {
      return of({
        ...order,
        items: this.orderItems.filter(oi => oi.orderId === order.id)
      });
    }
    return of(undefined);
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    const order = this.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
      return of({
        ...order,
        items: this.orderItems.filter(oi => oi.orderId === order.id)
      });
    }
    throw new Error('Commande non trouvée');
  }

  getOrderStatistics(): Observable<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
  }> {
    return this.getAllOrders().pipe(
      map(orders => {
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + parseFloat(order.totalAmount || 0), 0);
        const pendingOrders = orders.filter((order: any) => order.status === 'En attente' || order.status === OrderStatus.PENDING).length;
        const deliveredOrders = orders.filter((order: any) => order.status === 'Livrée' || order.status === OrderStatus.DELIVERED).length;

        return {
          totalOrders,
          totalRevenue,
          pendingOrders,
          deliveredOrders
        };
      }),
      catchError(() => of({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        deliveredOrders: 0
      }))
    );
  }
}

