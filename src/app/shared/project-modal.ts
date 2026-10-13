import { Component, HostListener, effect, inject, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService, ProjectStatus, STATUSES, TEAMS, Team } from '../core/project.service';
import { ToastService } from '../core/toast.service';

interface ProjectForm {
  name: string;
  team: Team;
  owner: string;
  startDate: string;
  dueDate: string;
  progress: number;
  status: ProjectStatus;
}

const iso = (offsetDays = 0) => new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);

/** Fenêtre de création / modification de projet (ouverte depuis la navbar et le tableau). */
@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="backdrop" *ngIf="service.modal() as m" (mousedown)="onBackdrop($event)">
      <form class="dialog" role="dialog" aria-modal="true" aria-labelledby="pm-title" (ngSubmit)="submit()" #f="ngForm" novalidate>
        <header class="dialog__head">
          <h2 id="pm-title">{{ m.mode === 'create' ? 'Nouveau projet' : 'Modifier le projet' }}</h2>
          <button type="button" class="dialog__close" aria-label="Fermer" (click)="service.closeModal()">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </header>

        <div class="dialog__body">
          <label class="field field--full">
            <span>Nom du projet *</span>
            <input name="name" [(ngModel)]="form.name" required maxlength="60" placeholder="ex. : Refonte du site web" autofocus />
            <em *ngIf="submitted && !form.name.trim()">Le nom est obligatoire.</em>
          </label>

          <label class="field">
            <span>Équipe</span>
            <select name="team" [(ngModel)]="form.team">
              <option *ngFor="let t of teams" [value]="t">{{ t }}</option>
            </select>
          </label>

          <label class="field">
            <span>Responsable *</span>
            <input name="owner" [(ngModel)]="form.owner" required maxlength="40" placeholder="Prénom et nom" />
            <em *ngIf="submitted && !form.owner.trim()">Le responsable est obligatoire.</em>
          </label>

          <label class="field">
            <span>Date de début</span>
            <input type="date" name="startDate" [(ngModel)]="form.startDate" required />
          </label>

          <label class="field">
            <span>Échéance</span>
            <input type="date" name="dueDate" [(ngModel)]="form.dueDate" required [min]="form.startDate" />
            <em *ngIf="submitted && form.dueDate < form.startDate">L'échéance doit être postérieure au début.</em>
          </label>

          <label class="field">
            <span>Statut</span>
            <select name="status" [(ngModel)]="form.status">
              <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
            </select>
          </label>

          <label class="field">
            <span>Avancement : <strong>{{ form.progress }}%</strong></span>
            <input type="range" name="progress" min="0" max="100" step="5" [(ngModel)]="form.progress" />
          </label>
        </div>

        <footer class="dialog__foot">
          <button type="button" class="btn btn--ghost" (click)="service.closeModal()">Annuler</button>
          <button type="submit" class="btn btn--primary">{{ m.mode === 'create' ? 'Créer le projet' : 'Enregistrer' }}</button>
        </footer>
      </form>
    </div>
  `,
  styles: `
    .backdrop {
      position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 1rem;
      background: rgba(10, 11, 23, .55); backdrop-filter: blur(3px); animation: fade .18s ease both;
    }
    .dialog {
      width: min(560px, 100%); max-height: calc(100vh - 2rem); overflow: auto;
      background: var(--surface); color: var(--text); border: 1px solid var(--border);
      border-radius: 1rem; box-shadow: var(--shadow-lg); animation: pop .22s ease both;
    }
    .dialog__head { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 1.4rem; border-bottom: 1px solid var(--border); }
    .dialog__head h2 { font-size: 1.1rem; font-weight: 800; }
    .dialog__close { border: none; background: none; color: var(--muted); width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: grid; place-items: center; }
    .dialog__close:hover { background: var(--surface-2); color: var(--text); }
    .dialog__body { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 1.4rem; }
    .dialog__foot { display: flex; justify-content: flex-end; gap: .6rem; padding: 1rem 1.4rem; border-top: 1px solid var(--border); background: var(--surface-2); border-radius: 0 0 1rem 1rem; }
    .field { display: flex; flex-direction: column; gap: .35rem; min-width: 0; }
    .field--full { grid-column: 1 / -1; }
    .field > span { font-size: .76rem; font-weight: 600; color: var(--muted); }
    .field em { font-style: normal; font-size: .74rem; color: var(--danger); }
    .field input:not([type='range']), .field select {
      width: 100%; padding: .65rem .85rem; border: 1px solid var(--border); border-radius: 8px;
      background: var(--surface); color: var(--text); font: inherit; font-size: .875rem; outline: none;
      transition: border-color .2s, box-shadow .2s;
    }
    .field input:focus, .field select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-ring); }
    .field input[type='range'] { accent-color: var(--primary); width: 100%; margin-top: .5rem; }
    @keyframes fade { from { opacity: 0; } }
    @keyframes pop { from { opacity: 0; transform: translateY(12px) scale(.98); } }
    @media (max-width: 520px) { .dialog__body { grid-template-columns: 1fr; } }
  `,
})
export class ProjectModal {
  readonly service = inject(ProjectService);
  private readonly toast = inject(ToastService);

  readonly teams = TEAMS;
  readonly statuses = STATUSES;
  submitted = false;
  form: ProjectForm = this.blank();

  constructor() {
    effect(() => {
      const m = this.service.modal();
      untracked(() => {
        this.submitted = false;
        this.form = m?.mode === 'edit' ? { ...m.project } : this.blank();
        if (m) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
      });
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.service.modal()) this.service.closeModal();
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.service.closeModal();
  }

  submit(): void {
    this.submitted = true;
    const f = this.form;
    if (!f.name.trim() || !f.owner.trim() || !f.startDate || !f.dueDate || f.dueDate < f.startDate) return;

    const status: ProjectStatus = f.progress >= 100 ? 'Terminé' : f.status;
    const progress = status === 'Terminé' ? 100 : f.progress;
    const data = { ...f, name: f.name.trim(), owner: f.owner.trim(), status, progress };
    const m = this.service.modal();
    if (m?.mode === 'edit') {
      this.service.update({ ...m.project, ...data });
      this.toast.show(`« ${data.name} » mis à jour`);
    } else {
      this.service.add(data);
      this.toast.show(`« ${data.name} » créé`);
    }
    this.service.closeModal();
  }

  private blank(): ProjectForm {
    return { name: '', team: 'DESIGN', owner: '', startDate: iso(), dueDate: iso(30), progress: 0, status: 'En cours' };
  }
}
