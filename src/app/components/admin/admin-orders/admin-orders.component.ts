import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order, OrderStatus } from '../../../models/order.model';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h1 style="color: var(--color-green);">Gestion des Commandes</h1>
        <a routerLink="/admin/dashboard" class="btn btn-secondary">
          Retour au tableau de bord
        </a>
      </div>

      <div class="card" style="margin-bottom: 2rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
          Filtrer par statut:
        </label>
        <select class="form-control" [(ngModel)]="statusFilter" (change)="filterOrders()" style="max-width: 300px;">
          <option value="">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="En cours">En cours</option>
          <option value="Expédiée">Expédiée</option>
          <option value="Livrée">Livrée</option>
          <option value="Annulée">Annulée</option>
        </select>
      </div>

      <div *ngFor="let order of filteredOrders" class="card" style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
          <div>
            <h3 style="color: var(--color-green); margin-bottom: 0.5rem;">
              Commande {{ order.orderNumber }}
            </h3>
            <p style="color: var(--color-gray);">
              Date: {{ order.createdAt | date:'dd/MM/yyyy à HH:mm' }}
            </p>
          </div>
          <div style="text-align: right;">
            <div style="margin-bottom: 0.5rem;">
              <label style="display: block; margin-bottom: 0.3rem; font-weight: bold;">Statut:</label>
              <select class="form-control" 
                      [value]="order.status" 
                      (change)="updateStatus(order.id, $any($event.target).value)"
                      style="min-width: 150px;">
                <option value="En attente">En attente</option>
                <option value="En cours">En cours</option>
                <option value="Expédiée">Expédiée</option>
                <option value="Livrée">Livrée</option>
                <option value="Annulée">Annulée</option>
              </select>
            </div>
            <p style="font-weight: bold; color: var(--color-gold); font-size: 1.3rem;">
              {{ order.totalAmount | number:'1.2-2' }} TND
            </p>
          </div>
        </div>

        <div style="margin-bottom: 1rem; padding: 1rem; background-color: var(--color-light-gray); border-radius: 5px;">
          <strong>Adresse de livraison:</strong><br>
          {{ order.shippingAddress }}<br>
          {{ order.shippingCity }} {{ order.shippingPostalCode }}<br>
          Téléphone: {{ order.shippingPhone }}
        </div>

        <div *ngIf="order.items && order.items.length > 0">
          <h4 style="margin-bottom: 0.5rem;">Articles:</h4>
          <table class="table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of order.items">
                <td>{{ getProductName(item.productId) }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.price | number:'1.2-2' }} MAD</td>
                <td style="font-weight: bold;">{{ (item.price * item.quantity) | number:'1.2-2' }} MAD</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="filteredOrders.length === 0" class="card" style="text-align: center; padding: 3rem;">
        <p style="font-size: 1.2rem;">Aucune commande trouvée.</p>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter = '';
  products: any[] = [];

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = orders;
      this.filteredOrders = orders;
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  filterOrders(): void {
    if (this.statusFilter) {
      this.filteredOrders = this.orders.filter(o => o.status === this.statusFilter);
    } else {
      this.filteredOrders = this.orders;
    }
  }

  updateStatus(orderId: number, status: string): void {
    this.orderService.updateOrderStatus(orderId, status as OrderStatus).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err) => {
        alert('Erreur lors de la mise à jour: ' + err.message);
      }
    });
  }

  getProductName(productId: number): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : 'Produit #' + productId;
  }
}

