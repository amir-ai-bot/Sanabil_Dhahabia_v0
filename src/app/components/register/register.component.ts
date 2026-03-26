import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top: 2rem;">
      <div class="card" style="max-width: 500px; margin: 0 auto;">
        <h1 style="text-align: center; color: var(--color-green); margin-bottom: 2rem;">
          Inscription
        </h1>

        <form (ngSubmit)="register()">
          <div class="form-group">
            <label>Prénom</label>
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="firstName"
              name="firstName"
              required
              placeholder="Jean">
          </div>

          <div class="form-group">
            <label>Nom</label>
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="lastName"
              name="lastName"
              required
              placeholder="Dupont">
          </div>

          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              class="form-control" 
              [(ngModel)]="email"
              name="email"
              required
              placeholder="votre@email.com">
          </div>

          <div class="form-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              class="form-control" 
              [(ngModel)]="password"
              name="password"
              required
              placeholder="••••••••"
              minlength="6">
            <small style="color: var(--color-gray);">Minimum 6 caractères</small>
          </div>

          <div *ngIf="error" class="alert alert-error">
            {{ error }}
          </div>

          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="processing"
            style="width: 100%; padding: 1rem; font-size: 1.1rem;">
            {{ processing ? 'Inscription...' : "S'inscrire" }}
          </button>
        </form>

        <div style="text-align: center; margin-top: 2rem;">
          <p>Déjà un compte ? 
            <a routerLink="/login" style="color: var(--color-gold); font-weight: bold;">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  error = '';
  processing = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.processing = true;
    this.error = '';

    this.authService.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.router.navigate(['/client/dashboard']);
      },
      error: (err) => {
        this.error = err.message || 'Erreur lors de l\'inscription';
        this.processing = false;
      }
    });
  }
}

