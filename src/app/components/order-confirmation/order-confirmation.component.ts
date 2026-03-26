import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container" style="padding-top: 2rem;">
      <div class="card" style="max-width: 800px; margin: 0 auto; text-align: center; padding: 3rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
        <h1 style="color: var(--color-green); margin-bottom: 1rem;">
          Commande confirmée !
        </h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">
          Merci pour votre commande. Nous avons bien reçu votre demande.
        </p>

        <div *ngIf="order" class="card" style="background-color: var(--color-light-gray); margin: 2rem 0; text-align: left;">
          <h2 style="color: var(--color-green); margin-bottom: 1rem;">Détails de la commande</h2>
          <div style="display: grid; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between;">
              <strong>Numéro de commande:</strong>
              <span style="color: var(--color-gold); font-weight: bold;">{{ order.orderNumber }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <strong>Date:</strong>
              <span>{{ order.createdAt | date:'dd/MM/yyyy à HH:mm' }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <strong>Statut:</strong>
              <span class="badge badge-info">{{ order.status }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <strong>Total:</strong>
              <span style="font-weight: bold; color: var(--color-gold); font-size: 1.2rem;">
                {{ order.totalAmount | number:'1.2-2' }} TND
              </span>
            </div>
          </div>
        </div>

        <div style="margin-top: 2rem;">
          <a routerLink="/client/commandes" class="btn btn-primary" style="margin-right: 1rem;">
            Voir mes commandes
          </a>
          <a routerLink="/catalogue" class="btn btn-secondary">
            Continuer les achats
          </a>
        </div>
      </div>
    </div>
  `
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | undefined;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getOrderById(+id).subscribe(order => {
        this.order = order;
      });
    }
  }
}

