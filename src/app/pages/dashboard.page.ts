import { Component, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../core/project.service';
import { StatCard } from '../shared/stat-card';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const BASE_WEEK = [12, 18, 15, 24, 20, 8, 5];

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, StatCard],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  readonly service = inject(ProjectService);
  readonly stats = this.service.stats;
  readonly upcoming = this.service.upcoming;
  private readonly today = new Date().toISOString().slice(0, 10);

  readonly greeting = (() => {
    const h = new Date().getHours();
    return h < 18 ? 'Bonjour' : 'Bonsoir';
  })();

  readonly todayLabel = new Date();

  readonly week = computed(() => {
    const scale = Math.max(0.15, this.stats().total / 14);
    const values = BASE_WEEK.map((v) => Math.max(1, Math.round(v * scale)));
    const max = Math.max(...values);
    return DAYS.map((day, i) => ({ day, value: values[i], height: Math.round((values[i] / max) * 100) }));
  });

  readonly weekTotal = computed(() => this.week().reduce((a, d) => a + d.value, 0));

  readonly donut = computed(() => {
    const s = this.stats();
    const total = s.total || 1;
    const parts = [
      { label: 'Terminé', value: s.completed, color: 'var(--success)' },
      { label: 'En cours', value: s.active, color: 'var(--primary)' },
      { label: 'En retard', value: s.delayed, color: 'var(--danger)' },
    ];
    let offset = 0;
    return parts.map((p) => {
      const pct = (p.value / total) * 100;
      const seg = { ...p, pct: Math.round(pct), dash: `${pct} ${100 - pct}`, offset: -offset };
      offset += pct;
      return seg;
    });
  });

  daysLeft(due: string): number {
    return Math.round((new Date(due).getTime() - new Date(this.today).getTime()) / 86_400_000);
  }

  dueLabel(due: string): string {
    const d = this.daysLeft(due);
    if (d < 0) return `${Math.abs(d)} j de retard`;
    if (d === 0) return 'Aujourd\'hui';
    return `${d} j restant${d > 1 ? 's' : ''}`;
  }
}
