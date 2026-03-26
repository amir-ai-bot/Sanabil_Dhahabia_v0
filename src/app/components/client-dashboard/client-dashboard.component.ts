import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { User } from '../../models/user.model';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container" style="padding-top: 2rem;">
      <h1 style="color: var(--color-green); margin-bottom: 2rem;">
        Bienvenue, {{ currentUser?.firstName }} {{ currentUser?.lastName }}
      </h1>

      <div class="grid grid-3" style="margin-bottom: 3rem;">
        <div class="card" style="text-align: center;">
          <h3 style="color: var(--color-gold); font-size: 2.5rem; margin-bottom: 0.5rem;">
            {{ totalOrders }}
          </h3>
          <p style="font-size: 1.1rem; color: var(--color-green);">Commandes totales</p>
        </div>
        <div class="card" style="text-align: center;">
          <h3 style="color: var(--color-gold); font-size: 2.5rem; margin-bottom: 0.5rem;">
            {{ pendingOrders }}
          </h3>
          <p style="font-size: 1.1rem; color: var(--color-green);">En attente</p>
        </div>
        <div class="card" style="text-align: center;">
          <h3 style="color: var(--color-gold); font-size: 2.5rem; margin-bottom: 0.5rem;">
            {{ deliveredOrders }}
          </h3>
          <p style="font-size: 1.1rem; color: var(--color-green);">Livrées</p>
        </div>
      </div>

      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h2 style="color: var(--color-green);">Commandes récentes</h2>
          <a routerLink="/client/commandes" class="btn btn-secondary">
            Voir toutes les commandes
          </a>
        </div>

        <div *ngIf="recentOrders.length === 0" style="text-align: center; padding: 2rem;">
          <p style="font-size: 1.1rem; color: var(--color-gray);">
            Vous n'avez pas encore de commandes.
          </p>
          <a routerLink="/catalogue" class="btn btn-primary" style="margin-top: 1rem;">
            Découvrir nos produits
          </a>
        </div>

        <table class="table" *ngIf="recentOrders.length > 0">
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
                <a routerLink="/client/commandes" class="btn btn-secondary" style="padding: 0.3rem 0.8rem;">
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
export class ClientDashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentOrders: Order[] = [];
  totalOrders = 0;
  pendingOrders = 0;
  deliveredOrders = 0;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadOrders(user.id);
      }
    });
  }

  loadOrders(userId: number): void {
    this.orderService.getOrdersByUser(userId).subscribe(orders => {
      this.recentOrders = orders.slice(0, 5);
      this.totalOrders = orders.length;
      this.pendingOrders = orders.filter(o => o.status === 'En attente').length;
      this.deliveredOrders = orders.filter(o => o.status === 'Livrée').length;
    });
  }
}

