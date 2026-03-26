import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { CartItem } from '../../models/cart.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top: 2rem;">
      <h1 style="color: var(--color-green); margin-bottom: 2rem;">Mon Panier</h1>

      <div *ngIf="cartItems.length === 0" class="card" style="text-align: center; padding: 3rem;">
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">Votre panier est vide.</p>
        <a routerLink="/catalogue" class="btn btn-primary">Continuer vos achats</a>
      </div>

      <div *ngIf="cartItems.length > 0" class="grid" style="grid-template-columns: 2fr 1fr; gap: 2rem;">
        <div>
          <div class="card" style="margin-bottom: 1rem;" *ngFor="let item of cartItems">
            <div style="display: grid; grid-template-columns: 150px 1fr auto; gap: 1.5rem; align-items: center;">
              <img [src]="getStoreImageUrl(item.product.image)" [alt]="item.product.name" 
                   style="width: 100%; border-radius: 5px;">
              <div>
                <h3 style="margin-bottom: 0.5rem; color: var(--color-green);">
                  {{ item.product.name }}
                </h3>
                <p class="price" style="margin: 0;">
                  {{ item.product.price | number:'1.2-2' }} TND
                </p>
              </div>
              <div style="text-align: right;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; justify-content: flex-end;">
                  <button 
                    class="btn btn-secondary" 
                    (click)="updateQuantity(item.product.id, item.quantity - 1)"
                    style="padding: 0.3rem 0.6rem; min-width: 35px;">-</button>
                  <input 
                    type="number" 
                    [value]="item.quantity"
                    (change)="updateQuantity(item.product.id, +$any($event.target).value)"
                    min="1"
                    [max]="item.product.stock"
                    style="width: 60px; text-align: center; padding: 0.3rem; border: 1px solid #ddd; border-radius: 3px;">
                  <button 
                    class="btn btn-secondary" 
                    (click)="updateQuantity(item.product.id, item.quantity + 1)"
                    [disabled]="item.quantity >= item.product.stock"
                    style="padding: 0.3rem 0.6rem; min-width: 35px;">+</button>
                </div>
                <p style="font-weight: bold; color: var(--color-gold); margin-bottom: 0.5rem;">
                  {{ (item.product.price * item.quantity) | number:'1.2-2' }} TND
                </p>
                <button 
                  class="btn btn-danger" 
                  (click)="removeItem(item.product.id)"
                  style="padding: 0.3rem 0.8rem; font-size: 0.9rem;">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="card" style="position: sticky; top: 2rem;">
            <h2 style="color: var(--color-green); margin-bottom: 1.5rem;">Résumé de la commande</h2>
            
            <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 2px solid #ddd;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Sous-total:</span>
                <span>{{ subtotal | number:'1.2-2' }} TND</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Livraison:</span>
                <span>Gratuite</span>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: bold; color: var(--color-green); margin-bottom: 1.5rem;">
              <span>Total:</span>
              <span style="color: var(--color-gold);">{{ total | number:'1.2-2' }} TND</span>
            </div>

            <a 
              [routerLink]="isAuthenticated ? '/commande' : '/login'"
              class="btn btn-primary" 
              style="width: 100%; text-align: center; padding: 1rem; font-size: 1.1rem;">
              {{ isAuthenticated ? 'Passer la commande' : 'Se connecter pour commander' }}
            </a>

            <a 
              routerLink="/catalogue"
              class="btn btn-secondary" 
              style="width: 100%; text-align: center; padding: 0.8rem; margin-top: 1rem;">
              Continuer les achats
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal = 0;
  total = 0;
  isAuthenticated = false;
  imageCacheBuster = Date.now().toString();

  constructor(
    private cartService: CartService,
    public productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.calculateTotals();
      this.bumpImageCache();
    });
    this.authService.currentUser$.subscribe(() => {
      this.isAuthenticated = this.authService.isAuthenticated();
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  private calculateTotals(): void {
    this.subtotal = this.cartService.getCartTotal();
    this.total = this.subtotal; // No shipping cost for now
  }

  getStoreImageUrl(img: string | null | undefined): string {
    return this.productService.getProductImageUrl(img || '', this.imageCacheBuster);
  }

  private bumpImageCache(): void {
    this.imageCacheBuster = Date.now().toString();
  }
}
