import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-page">
      <header class="page-header">
        <div>
          <h1>Utilisateurs</h1>
          <p>Gérez les membres de l’équipe, leurs rôles et autorisations d’accès.</p>
        </div>
      </header>

      <div class="users-grid">
        <div class="user-card" *ngFor="let u of userList">
          <div class="user-card__top">
            <div class="user-card__avatar-wrap">
              <img [src]="u.avatar" [alt]="u.name" class="user-card__avatar" />
              <span class="user-card__status" [class.user-card__status--online]="u.online"></span>
            </div>
            <div class="user-card__details">
              <h3 class="user-card__name">{{ u.name }}</h3>
              <span class="user-card__role">{{ u.role }}</span>
            </div>
          </div>

          <div class="user-card__meta">
            <div class="user-card__item">
              <span class="user-card__label">Email</span>
              <span class="user-card__val">{{ u.email }}</span>
            </div>
            <div class="user-card__item">
              <span class="user-card__label">Équipe</span>
              <span class="user-card__val">{{ u.team }}</span>
            </div>
            <div class="user-card__item">
              <span class="user-card__label">Projets actifs</span>
              <span class="user-card__val">{{ u.projects }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.25rem;
    }
    .user-card {
      background: var(--surface, #ffffff);
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid var(--border, #e5e7eb);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;

      &__top {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      &__avatar-wrap {
        position: relative;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: visible;
      }
      &__avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
      &__status {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #9ca3af;
        border: 2px solid #ffffff;
        &--online {
          background: #10b981;
        }
      }
      &__name {
        font-size: 1.05rem;
        font-weight: 700;
        margin: 0;
        color: var(--text, #0f172a);
      }
      &__role {
        font-size: 0.85rem;
        color: var(--muted, #64748b);
      }
      &__meta {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        border-top: 1px solid var(--border, #f1f5f9);
        padding-top: 1rem;
      }
      &__item {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
      }
      &__label {
        color: var(--muted, #64748b);
      }
      &__val {
        font-weight: 600;
        color: var(--text, #0f172a);
      }
    }
  `]
})
export class UsersPage {
  readonly userList = [
    {
      name: 'Sarah K.',
      role: 'Développeuse Frontend Senior',
      email: 'sarah.k@libraryui.com',
      team: 'INGÉNIERIE',
      projects: 6,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
      online: true
    },
    {
      name: 'Thomas B.',
      role: 'Lead UI/UX Designer',
      email: 'thomas.b@libraryui.com',
      team: 'DESIGN',
      projects: 4,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
      online: true
    },
    {
      name: 'Awa N.',
      role: 'Head of Product',
      email: 'awa.n@libraryui.com',
      team: 'PRODUIT',
      projects: 8,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face',
      online: true
    },
    {
      name: 'Albert Flores',
      role: 'Architecte Cloud',
      email: 'albert.f@libraryui.com',
      team: 'INGÉNIERIE',
      projects: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
      online: true
    },
    {
      name: 'Sofia Martin',
      role: 'Directrice Artistique',
      email: 'sofia.m@libraryui.com',
      team: 'DESIGN',
      projects: 3,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face',
      online: false
    },
    {
      name: 'Robert Fox',
      role: 'Responsable Marketing',
      email: 'robert.f@libraryui.com',
      team: 'MARKETING',
      projects: 4,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face',
      online: true
    }
  ];
}
