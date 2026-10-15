import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface RecentProject {
  title: string;
  time: string;
  badge: string;
  badgeType: 'success' | 'info';
  color: string;
  icon: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline';
}

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  // KPI Stats matching exact mockup
  readonly kpis = [
    {
      label: 'Projets',
      value: '128',
      color: '#10b981', // Emerald green
      icon: 'projects'
    },
    {
      label: 'Utilisateurs',
      value: '1.2k',
      color: '#8b5cf6', // Violet
      icon: 'users'
    },
    {
      label: 'Satisfaction',
      value: '98%',
      color: '#f97316', // Orange
      icon: 'satisfaction'
    }
  ];

  // Donut data matching exact mockup
  readonly donutData = [
    { label: 'Angular', pct: 68, color: '#94a3b8' },
    { label: 'React', pct: 20, color: '#06b6d4' },
    { label: 'Autres', pct: 12, color: '#eab308' },
  ];

  // Donut SVG circumference calculation (r = 58 -> circumference = 2 * PI * 58 ≈ 364.42)
  readonly donutCircumference = 364.42;
  get donutSegments() {
    let currentOffset = 0;
    return this.donutData.map(item => {
      const strokeDash = (item.pct / 100) * this.donutCircumference;
      const dashArray = `${strokeDash} ${this.donutCircumference - strokeDash}`;
      const offset = -currentOffset;
      currentOffset += strokeDash;
      return {
        ...item,
        dashArray,
        offset
      };
    });
  }

  // Recent projects matching exact mockup
  readonly recentProjects: RecentProject[] = [
    {
      title: 'Plateforme e-learning',
      time: 'Il y a 2 heures',
      badge: 'En cours',
      badgeType: 'success',
      color: '#ec4899', // Pink
      icon: 'book'
    },
    {
      title: 'Application mobile',
      time: 'Il y a 1 jour',
      badge: 'En cours',
      badgeType: 'info',
      color: '#ef4444', // Red
      icon: 'mobile'
    },
    {
      title: 'Dashboard analytics',
      time: 'Il y a 2 jours',
      badge: 'Terminé',
      badgeType: 'success',
      color: '#3b82f6', // Blue
      icon: 'chart'
    }
  ];

  // Team members matching exact mockup
  readonly members: TeamMember[] = [
    {
      name: 'Sarah K.',
      role: 'Développeuse',
      avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23f43f5e"/><circle cx="50" cy="40" r="20" fill="%23fbcfe8"/><path d="M26 38c0-12 10-20 24-20s24 8 24 20c0 4-2 8-5 10-1-8-7-14-19-14s-18 6-19 14c-3-2-5-6-5-10z" fill="%234c0519"/><path d="M18 95c0-18 15-30 32-30s32 12 32 30" fill="%23be123c"/><circle cx="43" cy="39" r="2.5" fill="%234c0519"/><circle cx="57" cy="39" r="2.5" fill="%234c0519"/><path d="M45 46c3 2 7 2 10 0" stroke="%234c0519" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
      status: 'online'
    },
    {
      name: 'Thomas B.',
      role: 'Designer',
      avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230284c7"/><circle cx="50" cy="40" r="20" fill="%23ffedd5"/><path d="M30 30c0-10 9-16 20-16s20 6 20 16c-4-4-10-6-20-6s-16 2-20 6z" fill="%231e293b"/><path d="M18 95c0-18 15-30 32-30s32 12 32 30" fill="%230369a1"/><circle cx="43" cy="39" r="2.5" fill="%230f172a"/><circle cx="57" cy="39" r="2.5" fill="%230f172a"/><path d="M46 46c2 2 6 2 8 0" stroke="%230f172a" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
      status: 'online'
    },
    {
      name: 'Awa N.',
      role: 'Product Manager',
      avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23eab308"/><circle cx="50" cy="40" r="20" fill="%23fed7aa"/><path d="M26 42c-2-12 8-24 24-24s26 12 24 24c-3-6-10-9-24-9s-21 3-24 9z" fill="%231c1917"/><path d="M18 95c0-18 15-30 32-30s32 12 32 30" fill="%23a16207"/><circle cx="43" cy="39" r="2.5" fill="%23451a03"/><circle cx="57" cy="39" r="2.5" fill="%23451a03"/><path d="M45 46c3 2 7 2 10 0" stroke="%23451a03" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
      status: 'online'
    }
  ];
}
