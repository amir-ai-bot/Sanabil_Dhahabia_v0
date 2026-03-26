import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, UserRole, LoginRequest, RegisterRequest } from '../models/user.model';
import { ApiService } from './api.service';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    // Vérifier si un utilisateur est stocké en localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // Connexion avec le backend PHP
  login(credentials: LoginRequest): Observable<User> {
    return this.apiService.login(credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          const user: User = {
            id: response.data.id,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            role: response.data.role === 'admin' ? UserRole.ADMIN : UserRole.CLIENT,
            createdAt: new Date()
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      }),
      catchError(error => {
        console.error('Erreur de connexion:', error);
        throw error;
      })
    );
  }

  // Inscription avec le backend PHP
  register(data: RegisterRequest): Observable<any> {
    return this.apiService.register(data).pipe(
      tap(response => {
        if (response.success) {
          console.log('Inscription réussie');
        }
      }),
      catchError(error => {
        console.error('Erreur d\'inscription:', error);
        throw error;
      })
    );
  }

  // Déconnexion
  logout(): Observable<void> {
    return this.apiService.logout().pipe(
      tap(() => {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      })
    );
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): Observable<boolean> {
    return new Observable(observer => {
      this.currentUser$.subscribe(user => {
        observer.next(user !== null);
      });
    });
  }

  // Vérifier si l'utilisateur est admin
  isAdmin(): Observable<boolean> {
    return new Observable(observer => {
      this.currentUser$.subscribe(user => {
        observer.next(user?.role === UserRole.ADMIN);
      });
    });
  }
}
