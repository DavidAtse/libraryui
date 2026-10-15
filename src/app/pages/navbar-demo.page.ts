import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar9Component } from '../libraryui/navbar-9/navbar-9.component';

@Component({
  selector: 'app-navbar-demo-page',
  standalone: true,
  imports: [CommonModule, Navbar9Component],
  template: `
    <div class="demo-page">
      <header class="page-header">
        <div>
          <h1>Composant LibraryUI : Navbar 9</h1>
          <p>Barre de navigation principale avec menu déroulant, barre de sous-catégories et recherche intégrée.</p>
        </div>
      </header>

      <div class="demo-container">
        <app-navbar-9 />
      </div>

      <div class="demo-notes">
        <h3>Caractéristiques du composant :</h3>
        <ul>
          <li>Double barre de navigation (barre blanche principale + ruban de sous-catégories sombre).</li>
          <li>Indicateurs actifs dynamiques, caret déroulant SVG, logo vectoriel adaptatif.</li>
          <li>Mode responsive complet avec menu hamburger mobile off-canvas.</li>
          <li>Gestion des filtres d'équipes et de l'état actif dans Taskly.</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .demo-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .demo-container {
      background: var(--surface, #ffffff);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border, #e5e7eb);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .demo-notes {
      background: var(--surface, #ffffff);
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid var(--border, #e5e7eb);
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
        color: var(--text, #0f172a);
      }
      ul {
        margin: 0;
        padding-left: 1.25rem;
        color: var(--muted, #64748b);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class NavbarDemoPage {}
