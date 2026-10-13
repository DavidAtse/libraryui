import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { ProjectService, TEAM_FILTERS, TeamFilter } from '../../core/project.service';
import { ThemeService } from '../../core/theme.service';

/** LibraryUI – Navbar 9 (adaptée pour Taskly). */
@Component({
  selector: 'app-navbar-9',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar-9.component.html',
  styleUrls: ['./navbar-9.component.scss']
})
export class Navbar9Component {
  private readonly router = inject(Router);
  private readonly projects = inject(ProjectService);
  readonly theme = inject(ThemeService);

  menuOpen = false;

  mainLinks = [
    { label: 'TABLEAU DE BORD', route: '/dashboard' },
    { label: 'PROJETS', route: '/projects' },
    { label: 'PARAMÈTRES', route: '/settings' },
    { label: 'SUPPORT', route: '/support' },
  ];
  categories = TEAM_FILTERS.map((label) => ({ label }));

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );
  readonly showStrip = computed(() => /^\/(dashboard|projects)/.test(this.url()));

  get activeCategory(): TeamFilter {
    return this.projects.team();
  }

  setCategoryActive(label: TeamFilter) { this.projects.team.set(label); }

  newProject() { this.projects.openCreate(); }

  goSearch() {
    this.menuOpen = false;
    this.router.navigate(['/projects'], { queryParams: { focus: 'search' } });
  }
}
