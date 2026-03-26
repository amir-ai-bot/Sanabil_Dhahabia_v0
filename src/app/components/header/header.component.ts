import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="nav-container">
        <a routerLink="/" class="logo">🌾 SANABEL DHAHABIA</a>
        <nav>
          <ul class="nav-menu">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Accueil</a></li>
            <li><a routerLink="/catalogue" routerLinkActive="active">Catalogue</a></li>
            <li>
              <a routerLink="/panier" routerLinkActive="active" *ngIf="!isAdmin">
                Panier <span class="badge badge-info" *ngIf="cartItemCount > 0">({{ cartItemCount }})</span>
              </a>
            </li>
            <li *ngIf="!currentUser">
              <a routerLink="/login" routerLinkActive="active">Connexion</a>
            </li>
            <li *ngIf="!currentUser">
              <a routerLink="/register" routerLinkActive="active">Inscription</a>
            </li>
            <li *ngIf="currentUser && !isAdmin">
              <a routerLink="/client/dashboard" routerLinkActive="active">Mon Compte</a>
            </li>
            <li *ngIf="isAdmin">
              <a routerLink="/admin/dashboard" routerLinkActive="active">Administration</a>
            </li>
            <li *ngIf="currentUser">
              <a href="#" (click)="logout($event)">Déconnexion</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .active {
      color: var(--color-gold) !important;
      font-weight: bold;
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  cartItemCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = this.cartService.getCartItemCount();
    });
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout().subscribe({
      next: () => {
        console.log('Déconnecté avec succès');
      },
      error: (err) => {
        console.error('Erreur déconnexion:', err);
        // Even on error, clear local state
        localStorage.removeItem('currentUser');
        this.currentUser = null;
      }
    });
  }
}

