import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-page">
      <header class="page-header">
        <div>
          <h1>Statistiques & Analytique</h1>
          <p>Indicateurs de performance détaillés de votre espace LibraryUI.</p>
        </div>
      </header>

      <div class="stats-cards-grid">
        <div class="stat-box" *ngFor="let s of metrics">
          <span class="stat-box__title">{{ s.title }}</span>
          <span class="stat-box__value">{{ s.value }}</span>
          <span class="stat-box__trend" [class.is-up]="s.isUp">{{ s.change }} par rapport au mois dernier</span>
        </div>
      </div>

      <div class="stats-details-card">
        <h2>Rendement des sprints</h2>
        <p class="stats-details-sub">Volume de tickets et composants livrés par équipe technique.</p>
        <div class="sprint-bars">
          <div class="sprint-row" *ngFor="let row of sprintData">
            <span class="sprint-name">{{ row.team }}</span>
            <div class="sprint-bar-wrap">
              <div class="sprint-bar" [style.width.%]="row.progress" [style.background-color]="row.color"></div>
            </div>
            <span class="sprint-val">{{ row.tickets }} livrés</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .stats-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
    }
    .stat-box {
      background: var(--surface, #ffffff);
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid var(--border, #e5e7eb);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      &__title {
        font-size: 0.85rem;
        color: var(--muted, #64748b);
        font-weight: 500;
      }
      &__value {
        font-size: 2rem;
        font-weight: 800;
        color: var(--text, #0f172a);
        line-height: 1.1;
      }
      &__trend {
        font-size: 0.8rem;
        color: var(--muted, #64748b);
        &.is-up {
          color: #10b981;
          font-weight: 600;
        }
      }
    }
    .stats-details-card {
      background: var(--surface, #ffffff);
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid var(--border, #e5e7eb);
      h2 {
        font-size: 1.15rem;
        font-weight: 700;
        margin: 0;
        color: var(--text, #0f172a);
      }
      .stats-details-sub {
        font-size: 0.85rem;
        color: var(--muted, #64748b);
        margin: 0.25rem 0 1.5rem;
      }
    }
    .sprint-bars {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .sprint-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .sprint-name {
      width: 120px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text, #0f172a);
    }
    .sprint-bar-wrap {
      flex: 1;
      height: 10px;
      background: #f1f5f9;
      border-radius: 999px;
      overflow: hidden;
    }
    .sprint-bar {
      height: 100%;
      border-radius: 999px;
      transition: width 0.6s ease;
    }
    .sprint-val {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--muted, #64748b);
      width: 90px;
      text-align: right;
    }
  `]
})
export class StatsPage {
  readonly metrics = [
    { title: 'Taux de livraison à temps', value: '94.2%', change: '+4.5%', isUp: true },
    { title: 'Temps moyen de complétion', value: '14.8 j', change: '-2.1 j', isUp: true },
    { title: 'Composants LibraryUI réutilisés', value: '42', change: '+12', isUp: true },
    { title: 'Satisfaction client globale', value: '4.9/5', change: '+0.2', isUp: true },
  ];

  readonly sprintData = [
    { team: 'Ingénierie', progress: 85, color: '#10b981', tickets: '48 tickets' },
    { team: 'Design UI/UX', progress: 92, color: '#8b5cf6', tickets: '36 écrans' },
    { team: 'Produit', progress: 78, color: '#f97316', tickets: '22 specs' },
    { team: 'Marketing', progress: 65, color: '#3b82f6', tickets: '16 campagnes' },
  ];
}
