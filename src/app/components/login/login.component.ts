import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top: 2rem;">
      <div class="card" style="max-width: 500px; margin: 0 auto;">
        <h1 style="text-align: center; color: var(--color-green); margin-bottom: 2rem;">
          Connexion
        </h1>

        <!-- ALERTE D'ERREUR AMÉLIORÉE -->
        <div *ngIf="error" class="alert-error-box" [@slideDown]>
          <div class="error-header">
            <span class="error-icon">⚠️</span>
            <span class="error-title">Erreur de connexion</span>
            <button class="error-close" (click)="closeError()" type="button">✕</button>
          </div>
          <div class="error-message">{{ error }}</div>
          <div class="error-suggestions" *ngIf="errorType === 'invalid'">
            <p style="margin: 0.5rem 0; font-size: 0.9rem;">
              <strong>Vérifiez:</strong>
            </p>
            <ul style="margin: 0.5rem 0; padding-left: 1.2rem; font-size: 0.85rem;">
              <li>L'email est correct</li>
              <li>Le mot de passe est exact</li>
              <li>Les majuscules/minuscules</li>
            </ul>
          </div>
        </div>

        <form (ngSubmit)="login()">
          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              class="form-control" 
              [class.input-error]="error && !email"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="votre@email.com"
              (focus)="closeError()">
          </div>

          <div class="form-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              class="form-control" 
              [class.input-error]="error && !password"
              [(ngModel)]="password"
              name="password"
              required
              placeholder="••••••••"
              (focus)="closeError()">
          </div>

          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="processing"
            style="width: 100%; padding: 1rem; font-size: 1.1rem;">
            {{ processing ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </form>

        <div style="text-align: center; margin-top: 2rem;">
          <p>Pas encore de compte ? 
            <a routerLink="/register" style="color: var(--color-gold); font-weight: bold;">
              S'inscrire
            </a>
          </p>
        </div>

        <div style="margin-top: 2rem; padding: 1rem; background-color: var(--color-light-gray); border-radius: 5px;">
          <p style="font-size: 0.9rem; color: var(--color-gray); margin-bottom: 0.5rem;">
            <strong>Compte de démonstration:</strong>
          </p>
          <p style="font-size: 0.85rem; color: var(--color-gray);">
            Admin: stesanabeldhahabia&#64;gmail.com / admin123<br>
            Client: client&#64;example.com / client123
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .alert-error-box {
      background: linear-gradient(135deg, #fee8e8 0%, #fef0f0 100%);
      border: 2px solid #e74c3c;
      border-radius: 8px;
      padding: 1.2rem;
      margin-bottom: 1.5rem;
      animation: slideInDown 0.4s ease-out;
    }

    .error-header {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 0.8rem;
    }

    .error-icon {
      font-size: 1.5rem;
      display: inline-block;
      animation: pulse 2s infinite;
    }

    .error-title {
      font-weight: bold;
      color: #c0392b;
      flex: 1;
    }

    .error-close {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #c0392b;
      padding: 0;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s;
    }

    .error-close:hover {
      background: rgba(192, 57, 43, 0.1);
    }

    .error-message {
      color: #c0392b;
      font-size: 0.95rem;
      margin-bottom: 0.8rem;
      font-weight: 500;
    }

    .error-suggestions {
      background: rgba(192, 57, 43, 0.05);
      padding: 0.8rem;
      border-radius: 5px;
      border-left: 3px solid #e74c3c;
      color: #555;
    }

    .error-suggestions ul {
      list-style-position: inside;
    }

    .error-suggestions li {
      padding: 0.2rem 0;
    }

    .input-error {
      border-color: #e74c3c !important;
      background-color: #fef8f8 !important;
    }

    .input-error:focus {
      border-color: #c0392b !important;
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
    }

    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  errorType: 'empty' | 'invalid' | 'network' = 'invalid';
  processing = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  closeError(): void {
    this.error = '';
  }

  login(): void {
    // Validation des champs vides
    if (!this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs (email et mot de passe)';
      this.errorType = 'empty';
      return;
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Veuillez entrer une adresse email valide';
      this.errorType = 'invalid';
      return;
    }

    this.processing = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (user) => {
        if (user.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/client/dashboard']);
        }
      },
      error: (err) => {
        this.processing = false;
        
        // Messages d'erreur spécifiques selon le type
        if (err.status === 401 || err.message?.includes('incorrect')) {
          this.error = 'Email ou mot de passe incorrect. Veuillez vérifier et réessayer.';
          this.errorType = 'invalid';
        } else if (err.status === 0 || err.message?.includes('network')) {
          this.error = 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
          this.errorType = 'network';
        } else {
          this.error = err.message || 'Une erreur s\'est produite lors de la connexion.';
          this.errorType = 'invalid';
        }
      }
    });
  }
}

