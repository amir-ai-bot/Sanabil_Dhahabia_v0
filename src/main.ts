import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './app/services/auth.service';

// Initializer to validate stored user on app load
export function initializeAuth(authService: AuthService) {
  return () => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Only restore if user has valid role
        if (user && user.role && (user.role === 'admin' || user.role === 'client')) {
          // User will be restored by AuthService constructor
          return;
        }
      } catch (e) {
        // Invalid JSON, clear it
        localStorage.removeItem('currentUser');
      }
    }
    // Ensure no stale user data
    localStorage.removeItem('currentUser');
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, FormsModule, ReactiveFormsModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    }
  ]
}).catch((err: Error) => console.error(err));

