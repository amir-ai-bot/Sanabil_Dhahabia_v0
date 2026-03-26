import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  // Cost per kilometer: 1 km = 1 dt (dinar)
  private readonly COST_PER_KM = 1;
  
  // Default origin city/address (main warehouse location)
  private readonly DEFAULT_ORIGIN = {
    city: 'Tunis',
    lat: 36.8065,
    lng: 10.1615
  };

  // City distance database (in km from Tunis)
  private readonly cityDistances: { [key: string]: number } = {
    'Tunis': 0,
    'Ariana': 15,
    'Ben Arous': 25,
    'Manouba': 30,
    'Zaghouan': 55,
    'Nabeul': 70,
    'Hammamet': 65,
    'Sousse': 140,
    'Monastir': 150,
    'Mahdia': 180,
    'Sfax': 330,
    'Gafsa': 380,
    'Tozeur': 450,
    'Kairouan': 180,
    'Sidi Bouzid': 250,
    'Kasserine': 280,
    'Kébili': 520,
    'Tataouine': 630,
    'Médenine': 580,
    'Djerba': 600,
    'Jendouba': 140,
    'Le Kef': 160,
    'Siliana': 100,
    'Bizerte': 70
  };

  constructor() { }

  /**
   * Calculate delivery cost based on city distance
   * Cost = Distance in km × 1 dt/km
   */
  calculateDeliveryCost(city: string): { distance: number; cost: number } {
    const cityKey = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    const distance = this.cityDistances[cityKey] || this.estimateDistance(city);
    const cost = distance * this.COST_PER_KM;

    return { distance, cost };
  }

  /**
   * Get all available cities for delivery
   */
  getAvailableCities(): string[] {
    return Object.keys(this.cityDistances).sort();
  }

  /**
   * Check if delivery is available to a city
   */
  isDeliveryAvailable(city: string): boolean {
    const cityKey = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    return this.cityDistances.hasOwnProperty(cityKey);
  }

  /**
   * Estimate distance for a city not in database
   * Using a simple formula: base distance + random factor
   */
  private estimateDistance(city: string): number {
    // Default estimate: 100 km
    return 100;
  }

  /**
   * Get delivery cost per km
   */
  getCostPerKm(): number {
    return this.COST_PER_KM;
  }
}
