import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div>
          <h3>🌾 SANABEL DHAHABIA</h3>
          <p>Votre partenaire de confiance pour tous vos besoins en matériel agricole.</p>
        </div>
        <div>
          <h3>Contact</h3>
          <p>📧 stesanabeldhahabia&#64;gmail.com</p>
          <p>📞 +216 76 280 193</p>
          <p>📍 Hay Nassim, Sidi Aich, Gafsa</p>
        </div>
        <div>
          <h3>Horaires</h3>
          <p>Lundi - Vendredi: 8h - 18h</p>
          <p>Samedi: 9h - 13h</p>
          <p>Dimanche: Fermé</p>
        </div>
      </div>
      <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.2);">
        <p>&copy; {{ currentYear }} SANABEL DHAHABIA. Tous droits réservés.</p>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}

