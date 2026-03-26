import { Product } from './product.model';

export enum OrderStatus {
  PENDING = 'En attente',
  PROCESSING = 'En cours',
  SHIPPED = 'Expédiée',
  DELIVERED = 'Livrée',
  CANCELLED = 'Annulée'
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingPhone: string;
  deliveryDistance?: number;
  shippingCost?: number;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
}
