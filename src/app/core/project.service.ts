import { Injectable, computed, effect, signal } from '@angular/core';

export type Team = 'DESIGN' | 'INGÉNIERIE' | 'MARKETING' | 'PRODUIT';
export type TeamFilter = 'TOUTES LES ÉQUIPES' | Team;
export type ProjectStatus = 'Terminé' | 'En cours' | 'En retard';

export const ALL_TEAMS: TeamFilter = 'TOUTES LES ÉQUIPES';
export const TEAMS: Team[] = ['DESIGN', 'INGÉNIERIE', 'MARKETING', 'PRODUIT'];
export const TEAM_FILTERS: TeamFilter[] = [ALL_TEAMS, ...TEAMS];
export const STATUSES: ProjectStatus[] = ['En cours', 'Terminé', 'En retard'];

export interface Project {
  id: number;
  name: string;
  code: string;
  team: Team;
  owner: string;
  startDate: string; // ISO aaaa-mm-jj
  dueDate: string; // ISO aaaa-mm-jj
  progress: number; // 0..100
  status: ProjectStatus;
}

export type ModalState = { mode: 'create' } | { mode: 'edit'; project: Project } | null;

const KEY = 'taskly.projects.v2';

const SEED: Project[] = [
  { id: 1, name: 'Refonte du site web', code: 'TSK-101', team: 'DESIGN', owner: 'Sofia Martin', startDate: '2026-08-24', dueDate: '2026-11-20', progress: 72, status: 'En cours' },
  { id: 2, name: 'Application mobile v2', code: 'TSK-102', team: 'INGÉNIERIE', owner: 'Albert Flores', startDate: '2026-07-06', dueDate: '2026-12-04', progress: 48, status: 'En cours' },
  { id: 3, name: 'Charte graphique', code: 'TSK-103', team: 'DESIGN', owner: 'Camille Durand', startDate: '2026-05-11', dueDate: '2026-09-18', progress: 100, status: 'Terminé' },
  { id: 4, name: 'Intégration des paiements', code: 'TSK-104', team: 'INGÉNIERIE', owner: 'Floyd Miles', startDate: '2026-06-01', dueDate: '2026-10-02', progress: 61, status: 'En retard' },
  { id: 5, name: 'Campagne d’automne', code: 'TSK-105', team: 'MARKETING', owner: 'Robert Fox', startDate: '2026-09-07', dueDate: '2026-11-06', progress: 35, status: 'En cours' },
  { id: 6, name: 'Parcours d’accueil client', code: 'TSK-106', team: 'PRODUIT', owner: 'Guy Hawkins', startDate: '2026-08-03', dueDate: '2026-10-30', progress: 84, status: 'En cours' },
  { id: 7, name: 'Pipeline d’analytique', code: 'TSK-107', team: 'INGÉNIERIE', owner: 'Bessie Cooper', startDate: '2026-04-20', dueDate: '2026-09-25', progress: 100, status: 'Terminé' },
  { id: 8, name: 'Refonte de la newsletter', code: 'TSK-108', team: 'MARKETING', owner: 'Younes Amrani', startDate: '2026-09-14', dueDate: '2026-10-09', progress: 28, status: 'En retard' },
  { id: 9, name: 'Design system 2.0', code: 'TSK-109', team: 'DESIGN', owner: 'Sofia Martin', startDate: '2026-09-21', dueDate: '2026-12-18', progress: 18, status: 'En cours' },
  { id: 10, name: 'Feuille de route publique', code: 'TSK-110', team: 'PRODUIT', owner: 'Guy Hawkins', startDate: '2026-07-27', dueDate: '2026-10-16', progress: 92, status: 'En cours' },
  { id: 11, name: 'Limitation du débit de l’API', code: 'TSK-111', team: 'INGÉNIERIE', owner: 'Albert Flores', startDate: '2026-08-10', dueDate: '2026-09-30', progress: 100, status: 'Terminé' },
  { id: 12, name: 'Webinaire partenaires', code: 'TSK-112', team: 'MARKETING', owner: 'Robert Fox', startDate: '2026-10-01', dueDate: '2026-11-27', progress: 12, status: 'En cours' },
  { id: 13, name: 'Audit d’accessibilité', code: 'TSK-113', team: 'PRODUIT', owner: 'Camille Durand', startDate: '2026-06-22', dueDate: '2026-10-05', progress: 54, status: 'En retard' },
  { id: 14, name: 'Bibliothèque d’icônes', code: 'TSK-114', team: 'DESIGN', owner: 'Bessie Cooper', startDate: '2026-05-04', dueDate: '2026-08-28', progress: 100, status: 'Terminé' },
];

@Injectable({ providedIn: 'root' })
export class ProjectService {
  /** Tous les projets (source de vérité, sauvegardée dans localStorage). */
  readonly all = signal<Project[]>(this.load());
  /** Équipe choisie dans la barre de catégories de la navbar. */
  readonly team = signal<TeamFilter>(ALL_TEAMS);
  /** État de la fenêtre de création / édition. */
  readonly modal = signal<ModalState>(null);

  /** Projets de l'équipe sélectionnée. */
  readonly projects = computed(() => {
    const t = this.team();
    return t === ALL_TEAMS ? this.all() : this.all().filter((p) => p.team === t);
  });

  readonly stats = computed(() => {
    const list = this.projects();
    const count = (s: ProjectStatus) => list.filter((p) => p.status === s).length;
    const avg = list.length ? Math.round(list.reduce((a, p) => a + p.progress, 0) / list.length) : 0;
    return {
      total: list.length,
      active: count('En cours'),
      completed: count('Terminé'),
      delayed: count('En retard'),
      members: new Set(list.map((p) => p.owner)).size,
      avgProgress: avg,
    };
  });

  /** Prochaines échéances parmi les projets non terminés. */
  readonly upcoming = computed(() =>
    this.projects()
      .filter((p) => p.status !== 'Terminé')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5),
  );

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(this.all()));
      } catch {
        /* stockage indisponible */
      }
    });
  }

  openCreate(): void {
    this.modal.set({ mode: 'create' });
  }

  openEdit(project: Project): void {
    this.modal.set({ mode: 'edit', project });
  }

  closeModal(): void {
    this.modal.set(null);
  }

  add(data: Omit<Project, 'id' | 'code'>): Project {
    const id = this.all().reduce((m, p) => Math.max(m, p.id), 0) + 1;
    const project: Project = { ...data, id, code: `TSK-${100 + id}` };
    this.all.update((list) => [project, ...list]);
    return project;
  }

  update(project: Project): void {
    this.all.update((list) => list.map((p) => (p.id === project.id ? project : p)));
  }

  remove(ids: number[]): Project[] {
    const removed = this.all().filter((p) => ids.includes(p.id));
    this.all.update((list) => list.filter((p) => !ids.includes(p.id)));
    return removed;
  }

  restore(projects: Project[]): void {
    this.all.update((list) => [...projects, ...list].sort((a, b) => a.id - b.id));
  }

  private load(): Project[] {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Project[];
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch {
      /* ignorer un stockage corrompu */
    }
    return SEED;
  }
}
