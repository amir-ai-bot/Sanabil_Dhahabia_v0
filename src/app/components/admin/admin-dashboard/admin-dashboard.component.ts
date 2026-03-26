import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container" style="padding-top: 2rem;">
      <h1 style="color: var(--color-green); margin-bottom: 2rem;">
        Tableau de bord Administrateur
      </h1>

      <div class="grid grid-4" style="margin-bottom: 3rem;">
        <div class="card" style="text-align: center;">
          <h3 style="color: var(--color-gold); font-size: 2.5rem; margin-bottom: 0.5rem;">
            {{ statistics.totalOrders }}
          </h3>
          <p style="font-size: 1.1rem; color: var(--color-green);">Commandes totales</p>
        </div>
        <div class="card" style="text-align: center;">
          <h3 style="color: var(--color-gold); font-size: 2.5rem; margin-bottom: 0.5rem;">
            {{ statistics.totalRevenue | number:'1.0-0' }} TND
          </h3>
          <p style="font-size: 1.1rem; color: var(--color-green);">Chiffre d'affaires</p>
        </div>
        <div class="card" style="text-align: center;">
          <h3 style="color: var(--color-gold); font-size: 2.5rem; margin-bottom: 0.5rem;">
            {{ statistics.pendingOrders }}
          </h3>
          <p style="font-size: 1.1rem; color: var(--color-green);">En attente</p>
        </div>
        <div class="card" style="text-align: center;">
          <h3 style="color: var(--color-gold); font-size: 2.5rem; margin-bottom: 0.5rem;">
            {{ statistics.deliveredOrders }}
          </h3>
          <p style="font-size: 1.1rem; color: var(--color-green);">Livrées</p>
        </div>
      </div>

      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
        <div class="card">
          <h2 style="color: var(--color-green); margin-bottom: 1rem;">Actions rapides</h2>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <a routerLink="/admin/produits" class="btn btn-primary" style="text-align: center;">
              Gérer les produits
            </a>
            <a routerLink="/admin/commandes" class="btn btn-primary" style="text-align: center;">
              Gérer les commandes
            </a>
          </div>
        </div>

        <div class="card">
          <h2 style="color: var(--color-green); margin-bottom: 1rem;">Alertes de stock</h2>
          <div *ngIf="lowStockProducts.length === 0" style="text-align: center; padding: 1rem;">
            <p style="color: var(--color-gray);">Aucune alerte de stock bas.</p>
          </div>
          <div *ngFor="let product of lowStockProducts" style="padding: 0.5rem; margin-bottom: 0.5rem; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 3px;">
            <strong>{{ product.name }}</strong> - {{ product.stock }} unités restantes
          </div>
        </div>
      </div>

      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h2 style="color: var(--color-green);">Commandes récentes</h2>
          <a routerLink="/admin/commandes" class="btn btn-secondary">
            Voir toutes les commandes
          </a>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Date</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of recentOrders">
              <td>{{ order.orderNumber }}</td>
              <td>{{ order.createdAt | date:'dd/MM/yyyy' }}</td>
              <td style="font-weight: bold; color: var(--color-gold);">
                {{ order.totalAmount | number:'1.2-2' }} TND
              </td>
              <td>
                <span class="badge" 
                      [ngClass]="{
                        'badge-info': order.status === 'En attente',
                        'badge-warning': order.status === 'En cours',
                        'badge-success': order.status === 'Livrée',
                        'badge-danger': order.status === 'Annulée'
                      }">
                  {{ order.status }}
                </span>
              </td>
              <td>
                <a routerLink="/admin/commandes" class="btn btn-secondary" style="padding: 0.3rem 0.8rem;">
                  Voir détails
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  statistics = {
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  };
  recentOrders: any[] = [];
  lowStockProducts: any[] = [];

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadRecentOrders();
    this.loadLowStockProducts();
  }

  loadStatistics(): void {
    this.orderService.getOrderStatistics().subscribe(stats => {
      this.statistics = stats;
    });
  }

  loadRecentOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.recentOrders = orders.slice(0, 5);
    });
  }

  loadLowStockProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.lowStockProducts = products.filter(p => p.stock <= 10 && p.stock > 0);
    });
  }
}

