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
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
      status: 'online'
    },
    {
      name: 'Thomas B.',
      role: 'Designer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
      status: 'online'
    },
    {
      name: 'Awa N.',
      role: 'Product Manager',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face',
      status: 'online'
    }
  ];
}
