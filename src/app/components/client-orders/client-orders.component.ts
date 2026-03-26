import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { Order } from '../../models/order.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h1 style="color: var(--color-green);">Mes Commandes</h1>
        <a routerLink="/client/dashboard" class="btn btn-secondary">
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

      <div *ngIf="loading" class="loading">
        <p>Chargement des commandes...</p>
      </div>

      <div *ngIf="!loading && filteredOrders.length === 0" class="card" style="text-align: center; padding: 3rem;">
        <p style="font-size: 1.2rem;">Aucune commande trouvée.</p>
        <a routerLink="/catalogue" class="btn btn-primary" style="margin-top: 1rem;">
          Découvrir nos produits
        </a>
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
            <span class="badge" 
                  [ngClass]="{
                    'badge-info': order.status === 'En attente',
                    'badge-warning': order.status === 'En cours',
                    'badge-success': order.status === 'Livrée',
                    'badge-danger': order.status === 'Annulée'
                  }"
                  style="font-size: 1rem; padding: 0.5rem 1rem; display: inline-block; margin-bottom: 0.5rem;">
              {{ order.status }}
            </span>
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
                <td>{{ item.price | number:'1.2-2' }} TND</td>
                <td style="font-weight: bold;">{{ (item.price * item.quantity) | number:'1.2-2' }} TND</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ClientOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter = '';
  loading = true;
  products: any[] = [];

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadOrders(user.id);
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  loadOrders(userId: number): void {
    this.orderService.getOrdersByUser(userId).subscribe(orders => {
      this.orders = orders;
      this.filteredOrders = orders;
      this.loading = false;
    });
  }

  getProductName(productId: number): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : 'Produit #' + productId;
  }

  filterOrders(): void {
    if (this.statusFilter) {
      this.filteredOrders = this.orders.filter(o => o.status === this.statusFilter);
    } else {
      this.filteredOrders = this.orders;
    }
  }
}

