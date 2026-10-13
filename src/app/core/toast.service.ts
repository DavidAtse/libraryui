import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  tone: 'success' | 'info' | 'danger';
  actionLabel?: string;
  action?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private seq = 0;

  show(
    message: string,
    options: { tone?: Toast['tone']; actionLabel?: string; action?: () => void; duration?: number } = {},
  ): void {
    const toast: Toast = {
      id: ++this.seq,
      message,
      tone: options.tone ?? 'success',
      actionLabel: options.actionLabel,
      action: options.action,
    };
    this.toasts.update((list) => [...list, toast]);
    setTimeout(() => this.dismiss(toast.id), options.duration ?? 4500);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
