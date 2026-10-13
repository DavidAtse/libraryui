import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar9Component } from './libraryui/navbar-9/navbar-9.component';
import { ProjectModal } from './shared/project-modal';
import { Toaster } from './shared/toaster';
import { ThemeService } from './core/theme.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar9Component, ProjectModal, Toaster],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // instantiated eagerly so the saved theme is applied at startup
  private readonly theme = inject(ThemeService);
  readonly year = new Date().getFullYear();
}
