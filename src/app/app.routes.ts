import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'catalogue', loadComponent: () => import('./components/catalogue/catalogue.component').then(m => m.CatalogueComponent) },
  { path: 'produit/:id', loadComponent: () => import('./components/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'panier', loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent) },
  { path: 'commande', canActivate: [authGuard], loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'confirmation/:id', canActivate: [authGuard], loadComponent: () => import('./components/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent) },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { path: 'client/dashboard', canActivate: [authGuard], loadComponent: () => import('./components/client-dashboard/client-dashboard.component').then(m => m.ClientDashboardComponent) },
  { path: 'client/commandes', canActivate: [authGuard], loadComponent: () => import('./components/client-orders/client-orders.component').then(m => m.ClientOrdersComponent) },
  { path: 'admin/dashboard', canActivate: [adminGuard], loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'admin/produits', canActivate: [adminGuard], loadComponent: () => import('./components/admin/admin-products/admin-products.component').then(m => m.AdminProductsComponent) },
  { path: 'admin/commandes', canActivate: [adminGuard], loadComponent: () => import('./components/admin/admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent) },
  { path: '**', redirectTo: '' }
];

