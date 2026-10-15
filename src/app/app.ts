import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from './core/theme.service';
import { ProjectModal } from './shared/project-modal';
import { Toaster } from './shared/toaster';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ProjectModal, Toaster],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  readonly sidebarOpen = signal<boolean>(false);
  readonly year = new Date().getFullYear();

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'home' },
    { label: 'Projets', route: '/projects', icon: 'projects' },
    { label: 'Utilisateurs', route: '/users', icon: 'users' },
    { label: 'Statistiques', route: '/stats', icon: 'stats' },
    { label: 'Messages', route: '/messages', icon: 'messages' },
    { label: 'Paramètres', route: '/settings', icon: 'settings' },
  ];

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const q = input.value.trim();
    if (q) {
      this.router.navigate(['/projects'], { queryParams: { q } });
    }
  }
}
