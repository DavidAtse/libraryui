import { Component, inject } from '@angular/core';
import { ProjectService } from '../core/project.service';
import { ProjectTable } from '../libraryui/project-table/project-table.component';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [ProjectTable],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <h1>Projets</h1>
          <p>{{ service.projects().length }} projets · {{ service.team() }}. Recherchez, triez et gérez vos projets ci-dessous.</p>
        </div>
      </header>
      <app-project-table />
    </section>
  `,
})
export class ProjectsPage {
  readonly service = inject(ProjectService);
}
