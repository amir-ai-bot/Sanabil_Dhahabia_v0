import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { DeliveryService } from '../../services/delivery.service';
import { CartItem } from '../../models/cart.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container" style="padding-top: 2rem;">
      <h1 style="color: var(--color-green); margin-bottom: 2rem;">Finaliser la commande</h1>

      <!-- ALERTE DE SUCCÈS -->
      <div *ngIf="successMessage" class="success-alert" [@slideDown]>
        <div class="success-header">
          <span class="success-icon">✓</span>
          <span class="success-title">Commande créée avec succès!</span>
          <button class="success-close" (click)="successMessage = ''" type="button">✕</button>
        </div>
        <div class="success-message">{{ successMessage }}</div>
        <button class="btn btn-success" (click)="router.navigate(['/client/dashboard'])" style="margin-top: 1rem; width: 100%;">
          Voir mes commandes
        </button>
      </div>

      <div *ngIf="cartItems.length === 0 && !successMessage" class="card" style="text-align: center; padding: 3rem;">
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">Votre panier est vide.</p>
        <a routerLink="/catalogue" class="btn btn-primary">Continuer vos achats</a>
      </div>

      <div *ngIf="cartItems.length > 0 && !successMessage" class="grid" style="grid-template-columns: 1.5fr 1fr; gap: 2rem;">
        <div class="card">
          <h2 style="color: var(--color-green); margin-bottom: 1.5rem;">Informations de livraison</h2>
          <form [formGroup]="checkoutForm" (ngSubmit)="submitOrder()">
            <div class="form-group">
              <label>Adresse</label>
              <input type="text" class="form-control" formControlName="address" required>
            </div>
            <div class="form-group">
              <label>Ville</label>
              <input type="text" class="form-control" formControlName="city" required>
            </div>
            <div class="form-group">
              <label>Code postal</label>
              <input type="text" class="form-control" formControlName="postalCode" required>
            </div>
            <div class="form-group">
              <label>Téléphone</label>
              <input type="tel" class="form-control" formControlName="phone" required>
            </div>
            <div class="form-group">
              <label>Distance estimée pour la livraison</label>
              <div style="display: flex; gap: 0.5rem;">
                <input type="number" class="form-control" formControlName="deliveryDistance" placeholder="km" min="0">
                <button type="button" class="btn btn-secondary" (click)="calculateDeliveryFromCity()" style="white-space: nowrap;">
                  Calculer
                </button>
              </div>
              <small style="color: #666;">Entrez la distance en km ou cliquez sur Calculer pour estimer basée sur la ville</small>
              <div *ngIf="deliveryInfo" style="margin-top: 0.5rem; padding: 0.5rem; background: #f0f0f0; border-radius: 4px;">
                <div style="font-size: 0.9rem;">
                  <strong>Distance:</strong> {{ deliveryInfo.distance }} km
                </div>
                <div style="font-size: 0.9rem; color: var(--color-green);">
                  <strong>Coût livraison:</strong> {{ deliveryInfo.cost }} TND
                </div>
              </div>
            </div>
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="checkoutForm.invalid || processing"
              style="width: 100%; padding: 1rem; font-size: 1.1rem;">
              {{ processing ? 'Traitement...' : 'Confirmer la commande' }}
            </button>
            <div *ngIf="error" class="alert alert-error" style="margin-top: 1rem;">
              {{ error }}
            </div>
          </form>
        </div>

        <div>
          <div class="card" style="position: sticky; top: 2rem;">
            <h2 style="color: var(--color-green); margin-bottom: 1.5rem;">Résumé de la commande</h2>
            
            <div style="margin-bottom: 1.5rem;">
              <div *ngFor="let item of cartItems" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>{{ item.product.name }} x{{ item.quantity }}</span>
                <span>{{ (item.product.price * item.quantity) | number:'1.2-2' }} TND</span>
              </div>
            </div>

            <div style="padding-top: 1rem; border-top: 2px solid #ddd; margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Sous-total:</span>
                <span>{{ subtotal | number:'1.2-2' }} TND</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Livraison ({{ deliveryInfo?.distance || 0 }} km):</span>
                <span>{{ (deliveryInfo?.cost || 0) | number:'1.2-2' }} TND</span>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: bold; color: var(--color-green);">
              <span>Total:</span>
              <span style="color: var(--color-gold);">{{ total | number:'1.2-2' }} TND</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-alert {
      background: linear-gradient(135deg, #d4edda 0%, #e8f5e9 100%);
      border: 2px solid #28a745;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      animation: slideInDown 0.4s ease-out;
    }

    .success-header {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 1rem;
    }

    .success-icon {
      font-size: 2rem;
      color: #28a745;
      animation: bounceIn 0.6s ease-out;
    }

    .success-title {
      font-weight: bold;
      color: #155724;
      font-size: 1.2rem;
      flex: 1;
    }

    .success-close {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #28a745;
      padding: 0;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s;
    }

    .success-close:hover {
      background: rgba(40, 167, 69, 0.1);
    }

    .success-message {
      color: #155724;
      font-size: 0.95rem;
      margin-bottom: 1rem;
      font-weight: 500;
    }

    .btn-success {
      background-color: #28a745;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.3s;
    }

    .btn-success:hover {
      background-color: #218838;
    }

    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: scale(0);
      }
      50% {
        opacity: 1;
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  checkoutForm: FormGroup;
  subtotal = 0;
  total = 0;
  processing = false;
  error = '';
  successMessage = '';
  currentUser: User | null = null;
  deliveryInfo: { distance: number; cost: number } | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private deliveryService: DeliveryService,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.checkoutForm = this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      phone: ['', Validators.required],
      deliveryDistance: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.subtotal = this.cartService.getCartTotal();
      this.updateTotal();
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Listen to delivery distance changes
    this.checkoutForm.get('deliveryDistance')?.valueChanges.subscribe(distance => {
      if (distance && distance > 0) {
        this.deliveryInfo = { distance, cost: distance * this.deliveryService.getCostPerKm() };
        this.updateTotal();
      }
    });
  }

  calculateDeliveryFromCity(): void {
    const city = this.checkoutForm.get('city')?.value;
    if (city && city.trim()) {
      const { distance, cost } = this.deliveryService.calculateDeliveryCost(city);
      this.checkoutForm.patchValue({ deliveryDistance: distance });
      this.deliveryInfo = { distance, cost };
      this.updateTotal();
    } else {
      alert('Veuillez saisir une ville valide');
    }
  }

  private updateTotal(): void {
    this.total = this.subtotal + (this.deliveryInfo?.cost || 0);
  }

  submitOrder(): void {
    if (this.checkoutForm.invalid || !this.currentUser) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.processing = true;
    this.error = '';

    const shippingInfo = {
      address: this.checkoutForm.value.address,
      city: this.checkoutForm.value.city,
      postalCode: this.checkoutForm.value.postalCode,
      phone: this.checkoutForm.value.phone,
      deliveryDistance: this.deliveryInfo?.distance || this.checkoutForm.value.deliveryDistance,
      shippingCost: this.deliveryInfo?.cost || 0
    };

    this.orderService.createOrder(this.currentUser.id, this.cartItems, shippingInfo).subscribe({
      next: (order) => {
        // ✅ Vider le panier et synchroniser avec le backend
        this.cartService.clearCartWithBackend(this.currentUser!.id).subscribe({
          next: () => {
            // ✅ Afficher le message de succès
            this.successMessage = `Commande #${order.orderNumber} créée avec succès! ✓\n\nVotre panier a été vidé automatiquement.\nVous allez être redirigé dans 5 secondes...`;
            this.processing = false;
            
            // ✅ Réinitialiser le formulaire
            this.checkoutForm.reset();
            
            // ✅ Redirection après 5 secondes
            setTimeout(() => {
              this.router.navigate(['/confirmation', order.id]);
            }, 5000);
          },
          error: (err) => {
            console.warn('Erreur lors du vidage du panier serveur, vidage local appliqué:', err);
            // Même avec une erreur, on continue
            this.successMessage = `Commande #${order.orderNumber} créée avec succès! ✓\n\nVotre panier a été vidé automatiquement.\nVous allez être redirigé dans 5 secondes...`;
            this.processing = false;
            this.checkoutForm.reset();
            setTimeout(() => {
              this.router.navigate(['/confirmation', order.id]);
            }, 5000);
          }
        });
      },
      error: (err) => {
        this.processing = false;
        this.error = err.message || 'Une erreur est survenue lors de la création de la commande.';
        console.error('Erreur création commande:', err);
      }
    });
  }
}

