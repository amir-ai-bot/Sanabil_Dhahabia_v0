/* 
  EXEMPLE D'UTILISATION: Services PHP dans les Composants Angular
  ================================================================
*/

// ==========================================
// 1. COMPOSANT DE LOGIN
// ==========================================

import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onLogin()">
      <input [(ngModel)]="credentials.email" name="email" placeholder="Email" required>
      <input [(ngModel)]="credentials.password" name="password" type="password" placeholder="Mot de passe" required>
      <button type="submit">Connexion</button>
      <div *ngIf="error" class="error">{{ error }}</div>
    </form>
  `
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.credentials).subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      error => {
        this.error = 'Email ou mot de passe incorrect';
      }
    );
  }
}

// ==========================================
// 2. COMPOSANT DE CATALOGUE
// ==========================================

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-catalogue',
  template: `
    <div class="products">
      <div *ngFor="let product of products" class="product-card">
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <p class="price">{{ product.price | currency }}</p>
        <button (click)="addToCart(product)">Ajouter au panier</button>
      </div>
    </div>
    <div *ngIf="loading" class="loading">Chargement...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
  `
})
export class CatalogueComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(
      (products) => {
        this.products = products;
        this.loading = false;
      },
      (error) => {
        this.error = 'Erreur lors du chargement des produits';
        this.loading = false;
      }
    );
  }

  addToCart(product: Product) {
    // Logique du panier
    console.log('Ajouté au panier:', product);
  }
}

// ==========================================
// 3. COMPOSANT DE DÉTAIL PRODUIT
// ==========================================

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-detail',
  template: `
    <div *ngIf="product" class="product-detail">
      <h1>{{ product.name }}</h1>
      <img [src]="product.image" [alt]="product.name">
      <p>{{ product.description }}</p>
      <p class="price">{{ product.price | currency }}</p>
      <p *ngIf="product.stock > 0" class="in-stock">En stock: {{ product.stock }}</p>
      <p *ngIf="product.stock === 0" class="out-of-stock">Rupture de stock</p>
      <button [disabled]="product.stock === 0">Ajouter au panier</button>
    </div>
    <div *ngIf="loading" class="loading">Chargement...</div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadProduct(id);
    });
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe(
      (product) => {
        this.product = product;
        this.loading = false;
      },
      (error) => {
        console.error('Erreur:', error);
        this.loading = false;
      }
    );
  }
}

// ==========================================
// 4. COMPOSANT DE CHECKOUT
// ==========================================

import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-checkout',
  template: `
    <form (ngSubmit)="onCheckout()">
      <h2>Adresse de livraison</h2>
      <input [(ngModel)]="shippingInfo.address" name="address" placeholder="Adresse" required>
      <input [(ngModel)]="shippingInfo.city" name="city" placeholder="Ville" required>
      <input [(ngModel)]="shippingInfo.postalCode" name="postalCode" placeholder="Code postal" required>
      <input [(ngModel)]="shippingInfo.phone" name="phone" placeholder="Téléphone" required>
      <input [(ngModel)]="shippingInfo.deliveryDistance" name="distance" type="number" placeholder="Distance (km)">
      
      <h2>Résumé</h2>
      <p>Montant total: {{ totalAmount | currency }}</p>
      
      <button type="submit" [disabled]="isProcessing">
        {{ isProcessing ? 'Traitement...' : 'Valider la commande' }}
      </button>
      
      <div *ngIf="success" class="success">Commande créée avec succès!</div>
      <div *ngIf="error" class="error">{{ error }}</div>
    </form>
  `
})
export class CheckoutComponent {
  shippingInfo = {
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    deliveryDistance: undefined,
    shippingCost: 0
  };
  totalAmount = 0;
  isProcessing = false;
  success = false;
  error = '';

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.calculateTotal();
  }

  calculateTotal() {
    // Logique pour calculer le total
  }

  onCheckout() {
    this.isProcessing = true;
    
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        const cartItems = this.cartService.getItems();
        
        this.orderService.createOrder(user.id, cartItems, this.shippingInfo).subscribe(
          (order) => {
            this.success = true;
            this.isProcessing = false;
            this.cartService.clear();
          },
          (error) => {
            this.error = 'Erreur lors de la création de la commande';
            this.isProcessing = false;
          }
        );
      }
    });
  }
}

// ==========================================
// 5. COMPOSANT DES COMMANDES UTILISATEUR
// ==========================================

import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { Order } from '../models/order.model';

@Component({
  selector: 'app-client-orders',
  template: `
    <h2>Mes commandes</h2>
    <table *ngIf="orders.length > 0">
      <thead>
        <tr>
          <th>Numéro</th>
          <th>Date</th>
          <th>Montant</th>
          <th>Statut</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let order of orders">
          <td>{{ order.orderNumber }}</td>
          <td>{{ order.createdAt | date }}</td>
          <td>{{ order.totalAmount | currency }}</td>
          <td>{{ order.status }}</td>
          <td>
            <button (click)="viewOrder(order.id)">Détails</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p *ngIf="orders.length === 0">Aucune commande</p>
  `
})
export class ClientOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.loadOrders(user.id);
      }
    });
  }

  loadOrders(userId: number) {
    this.orderService.getUserOrders(userId).subscribe(
      (orders) => {
        this.orders = orders;
      },
      (error) => {
        console.error('Erreur:', error);
      }
    );
  }

  viewOrder(orderId: number) {
    // Naviguez vers la page de détail
  }
}

// ==========================================
// 6. COMPOSANT ADMIN - GESTION DES PRODUITS
// ==========================================

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-admin-products',
  template: `
    <div class="admin-products">
      <h2>Gestion des produits</h2>
      <button (click)="showAddForm = !showAddForm">Ajouter un produit</button>
      
      <form *ngIf="showAddForm" (ngSubmit)="addProduct()">
        <input [(ngModel)]="newProduct.name" name="name" placeholder="Nom" required>
        <textarea [(ngModel)]="newProduct.description" name="description" placeholder="Description"></textarea>
        <input [(ngModel)]="newProduct.price" name="price" type="number" placeholder="Prix" required>
        <input [(ngModel)]="newProduct.stock" name="stock" type="number" placeholder="Stock" required>
        <button type="submit">Créer</button>
      </form>
      
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let product of products">
            <td>{{ product.name }}</td>
            <td>{{ product.price | currency }}</td>
            <td>{{ product.stock }}</td>
            <td>
              <button (click)="editProduct(product)">Modifier</button>
              <button (click)="deleteProduct(product.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  showAddForm = false;
  newProduct = { name: '', description: '', price: 0, stock: 0 };

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        console.error('Erreur:', error);
      }
    );
  }

  addProduct() {
    this.productService.createProduct(this.newProduct).subscribe(
      () => {
        this.loadProducts();
        this.newProduct = { name: '', description: '', price: 0, stock: 0 };
        this.showAddForm = false;
      },
      (error) => {
        console.error('Erreur:', error);
      }
    );
  }

  editProduct(product: Product) {
    // Logique de modification
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(
      () => {
        this.loadProducts();
      },
      (error) => {
        console.error('Erreur:', error);
      }
    );
  }
}
