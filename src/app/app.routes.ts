import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    title: 'Tableau de bord · Taskly',
    loadComponent: () => import('./pages/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'projects',
    title: 'Projets · Taskly',
    loadComponent: () => import('./pages/projects.page').then((m) => m.ProjectsPage),
  },
  {
    path: 'settings',
    title: 'Paramètres · Taskly',
    loadComponent: () => import('./pages/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'support',
    title: 'Support & Assistance · Taskly',
    loadComponent: () => import('./pages/support.page').then((m) => m.SupportPage),
  },
  { path: '**', redirectTo: 'dashboard' },
];
