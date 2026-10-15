import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    title: 'Dashboard · LibraryUI',
    loadComponent: () => import('./pages/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'projects',
    title: 'Projets · LibraryUI',
    loadComponent: () => import('./pages/projects.page').then((m) => m.ProjectsPage),
  },
  {
    path: 'users',
    title: 'Utilisateurs · LibraryUI',
    loadComponent: () => import('./pages/users.page').then((m) => m.UsersPage),
  },
  {
    path: 'stats',
    title: 'Statistiques · LibraryUI',
    loadComponent: () => import('./pages/stats.page').then((m) => m.StatsPage),
  },
  {
    path: 'messages',
    title: 'Messages · LibraryUI',
    loadComponent: () => import('./pages/support.page').then((m) => m.SupportPage),
  },
  {
    path: 'navbar',
    title: 'Navbar 9 · LibraryUI',
    loadComponent: () => import('./pages/navbar-demo.page').then((m) => m.NavbarDemoPage),
  },
  {
    path: 'support',
    redirectTo: 'messages',
  },
  {
    path: 'settings',
    title: 'Paramètres · LibraryUI',
    loadComponent: () => import('./pages/settings.page').then((m) => m.SettingsPage),
  },
  { path: '**', redirectTo: 'dashboard' },
];
