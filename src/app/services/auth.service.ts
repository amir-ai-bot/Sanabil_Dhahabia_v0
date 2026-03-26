import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { User, UserRole, LoginRequest, RegisterRequest } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ApiService) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Only restore valid users with role property
        if (user && user.role && (user.role === 'admin' || user.role === 'client' || user.role === 'seller')) {
          this.currentUserSubject.next(user);
        } else {
          localStorage.removeItem('currentUser');
        }
      } catch (e) {
        console.error('Invalid stored user data:', e);
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.api.login(credentials).pipe(
      map((res: any) => res.data || res),
      tap((user: User) => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.api.register(data).pipe(
      map((res: any) => res.data || res),
      tap((user: User) => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.api.logout().pipe(
      tap(() => {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === UserRole.ADMIN;
  }
}

