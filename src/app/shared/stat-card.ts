import { Component, computed, effect, input, signal, untracked } from '@angular/core';

/** Carte KPI compacte avec compteur animé et mini-courbe. */
@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <article class="card" [class]="'card tone-' + tone()">
      <div class="card__top">
        <span class="card__icon" aria-hidden="true">
          <ng-content select="[icon]" />
        </span>
        <span class="card__label">{{ label() }}</span>
      </div>
      <div class="card__value">{{ display() }}<small>{{ suffix() }}</small></div>
      <div class="card__bottom">
        <span class="card__hint">{{ hint() }}</span>
        <svg class="card__spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
          <path [attr.d]="areaPath()" class="card__area" />
          <path [attr.d]="linePath()" class="card__line" />
        </svg>
      </div>
    </article>
  `,
  styles: `
    :host { display: block; }
    .card {
      --tone: var(--primary);
      --tone-soft: var(--primary-soft);
      height: 100%;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 1.1rem 1.25rem 1rem;
      transition: transform var(--ease), box-shadow var(--ease);
    }
    .card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
    .tone-success { --tone: var(--success); --tone-soft: var(--success-soft); }
    .tone-warning { --tone: var(--warning); --tone-soft: var(--warning-soft); }
    .tone-danger { --tone: var(--danger); --tone-soft: var(--danger-soft); }
    .card__top { display: flex; align-items: center; gap: .65rem; }
    .card__icon {
      display: grid; place-items: center; width: 36px; height: 36px; border-radius: 10px;
      background: var(--tone-soft); color: var(--tone);
    }
    .card__icon :is(svg) { width: 18px; height: 18px; }
    .card__label { font-size: .82rem; font-weight: 600; color: var(--muted); }
    .card__value {
      margin: .85rem 0 .35rem; font-size: 2rem; font-weight: 800; letter-spacing: -.03em;
      color: var(--text); font-variant-numeric: tabular-nums; line-height: 1.1;
    }
    .card__value small { font-size: 1rem; font-weight: 700; color: var(--muted); margin-left: .15rem; }
    .card__bottom { display: flex; align-items: flex-end; justify-content: space-between; gap: .75rem; }
    .card__hint { font-size: .75rem; color: var(--muted); }
    .card__spark { width: 96px; height: 30px; flex-shrink: 0; overflow: visible; }
    .card__line { fill: none; stroke: var(--tone); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
    .card__area { fill: var(--tone-soft); stroke: none; }
    @media (max-width: 480px) {
      .card { padding: 0.95rem 1rem 0.85rem; }
      .card__value { font-size: 1.75rem; margin: 0.65rem 0 0.25rem; }
      .card__spark { width: 78px; height: 26px; }
    }
  `,
})
export class StatCard {
  label = input.required<string>();
  value = input.required<number>();
  suffix = input('');
  hint = input('');
  tone = input<'primary' | 'success' | 'warning' | 'danger'>('primary');
  spark = input<number[]>([3, 5, 4, 7, 6, 9, 8]);

  readonly display = signal(0);

  readonly linePath = computed(() => this.path(false));
  readonly areaPath = computed(() => this.path(true));

  constructor() {
    effect((onCleanup) => {
      const target = this.value();
      const from = untracked(() => this.display());
      const start = performance.now();
      const duration = 650;
      let frame = 0;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        this.display.set(Math.round(from + (target - from) * eased));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      onCleanup(() => cancelAnimationFrame(frame));
    });
  }

  private path(area: boolean): string {
    const data = this.spark();
    if (data.length < 2) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => [(i / (data.length - 1)) * 100, 27 - ((v - min) / range) * 24] as const);
    const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    return area ? `${line} L100,30 L0,30 Z` : line;
  }
}
