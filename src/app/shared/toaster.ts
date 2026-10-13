import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toaster" aria-live="polite" aria-atomic="false">
      <div class="toast" *ngFor="let t of toasts.toasts()" [ngClass]="'toast--' + t.tone" role="status">
        <span class="toast__dot" aria-hidden="true"></span>
        <span class="toast__msg">{{ t.message }}</span>
        <button *ngIf="t.actionLabel" class="toast__action" (click)="run(t.id, t.action)">{{ t.actionLabel }}</button>
        <button class="toast__close" aria-label="Fermer" (click)="toasts.dismiss(t.id)">×</button>
      </div>
    </div>
  `,
  styles: `
    .toaster { position: fixed; right: 1rem; bottom: 1rem; z-index: 200; display: flex; flex-direction: column; gap: .5rem; width: min(380px, calc(100vw - 2rem)); }
    .toast {
      display: flex; align-items: center; gap: .65rem; padding: .75rem .9rem;
      background: var(--surface); color: var(--text); border: 1px solid var(--border);
      border-left: 4px solid var(--success); border-radius: .65rem; box-shadow: var(--shadow-lg);
      font-size: .85rem; animation: in .25s ease both;
    }
    .toast--danger { border-left-color: var(--danger); }
    .toast--info { border-left-color: var(--primary); }
    .toast__dot { display: none; }
    .toast__msg { flex: 1; }
    .toast__action { border: none; background: none; color: var(--primary); font: inherit; font-weight: 700; cursor: pointer; padding: .2rem .4rem; border-radius: .35rem; }
    .toast__action:hover { background: var(--primary-soft); }
    .toast__close { border: none; background: none; color: var(--muted); font-size: 1.2rem; line-height: 1; cursor: pointer; }
    @keyframes in { from { opacity: 0; transform: translateX(16px); } }
  `,
})
export class Toaster {
  readonly toasts = inject(ToastService);

  run(id: number, action?: () => void): void {
    action?.();
    this.toasts.dismiss(id);
  }
}
