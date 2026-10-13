import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Project, ProjectService, ProjectStatus, STATUSES } from '../../core/project.service';
import { ToastService } from '../../core/toast.service';

type SortKey = 'name' | 'startDate' | 'dueDate' | 'progress';

/** LibraryUI – Table (à l'origine « ship-table »), adaptée aux projets Taskly. */
@Component({
  selector: 'app-project-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.scss']
})
export class ProjectTable {
  private readonly service = inject(ProjectService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly statuses = STATUSES;
  readonly pageSize = 6;
  private readonly today = new Date().toISOString().slice(0, 10);

  readonly searchTerm = signal('');
  readonly statusFilter = signal<ProjectStatus | 'ALL'>('ALL');
  readonly currentPage = signal(1);
  readonly sortKey = signal<SortKey>('dueDate');
  readonly sortDir = signal<'asc' | 'desc'>('asc');
  private readonly selectedIds = signal<Set<number>>(new Set());

  constructor() {
    if (this.route.snapshot.queryParamMap.get('focus') === 'search') {
      setTimeout(() => this.searchInput()?.nativeElement.focus());
    }
    // garde la page courante valide quand les données changent (suppression, filtre d'équipe...)
    effect(() => {
      const max = this.totalPages();
      if (this.currentPage() > max) this.currentPage.set(max);
    });
  }

  readonly filtered = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();
    const key = this.sortKey();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return this.service
      .projects()
      .filter(
        (p) =>
          (status === 'ALL' || p.status === status) &&
          (!term ||
            p.name.toLowerCase().includes(term) ||
            p.code.toLowerCase().includes(term) ||
            p.owner.toLowerCase().includes(term) ||
            p.status.toLowerCase().includes(term)),
      )
      .sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        return (typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv))) * dir;
      });
  });

  readonly totalItems = computed(() => this.filtered().length);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize)));
  readonly pageItems = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });
  readonly rangeStart = computed(() => (this.totalItems() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1));
  readonly rangeEnd = computed(() => Math.min(this.currentPage() * this.pageSize, this.totalItems()));

  readonly pageNumbers = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const cur = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (cur > 3) pages.push('...');
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
    if (cur < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  });

  readonly selectedCount = computed(() => this.selectedIds().size);
  readonly allSelected = computed(
    () => this.pageItems().length > 0 && this.pageItems().every((p) => this.selectedIds().has(p.id)),
  );

  trackById = (_: number, p: Project) => p.id;

  onSearch(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  onFilter(value: ProjectStatus | 'ALL'): void {
    this.statusFilter.set(value);
    this.currentPage.set(1);
  }

  sortBy(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }

  sortIcon(key: SortKey): string {
    return this.sortKey() === key ? (this.sortDir() === 'asc' ? '↑' : '↓') : '';
  }

  ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
    return this.sortKey() === key ? (this.sortDir() === 'asc' ? 'ascending' : 'descending') : 'none';
  }

  isSelected(id: number): boolean {
    return this.selectedIds().has(id);
  }

  toggleOne(id: number): void {
    this.selectedIds.update((set) => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  toggleAll(): void {
    const all = this.allSelected();
    this.selectedIds.update((set) => {
      const next = new Set(set);
      this.pageItems().forEach((p) => (all ? next.delete(p.id) : next.add(p.id)));
      return next;
    });
  }

  goToPage(p: number | '...'): void {
    if (typeof p === 'number') { this.currentPage.set(p); }
  }

  prevPage(): void {
    if (this.currentPage() > 1) { this.currentPage.update((p) => p - 1); }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) { this.currentPage.update((p) => p + 1); }
  }

  editProject(p: Project): void {
    this.service.openEdit(p);
  }

  addProject(): void {
    this.service.openCreate();
  }

  deleteProject(p: Project): void {
    this.removeWithUndo([p.id]);
  }

  deleteSelected(): void {
    this.removeWithUndo([...this.selectedIds()]);
  }

  isLate(p: Project): boolean {
    return p.status !== 'Terminé' && p.dueDate < this.today;
  }

  statusKey(s: ProjectStatus): string {
    return s === 'Terminé' ? 'ok' : s === 'En retard' ? 'late' : 'run';
  }

  private removeWithUndo(ids: number[]): void {
    const removed = this.service.remove(ids);
    this.selectedIds.update((set) => {
      const next = new Set(set);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    this.toast.show(removed.length > 1 ? `${removed.length} projets supprimés` : `« ${removed[0]?.name} » supprimé`, {
      tone: 'danger',
      actionLabel: 'Annuler',
      action: () => this.service.restore(removed),
    });
  }
}
