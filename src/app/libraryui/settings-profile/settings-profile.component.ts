import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService, TEAM_FILTERS } from '../../core/project.service';
import { ThemeService } from '../../core/theme.service';
import { ToastService } from '../../core/toast.service';

interface SettingsTab {
  icon: string;
  label: string;
  active?: boolean;
}

interface NotificationPref {
  key: string;
  title: string;
  description: string;
  enabled: boolean;
}

const KEY = 'taskly.profile.v1';
const DEFAULT_AVATAR =
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop';

const DEFAULT_FORM = {
  businessName: 'Taskly Studio',
  emailAddress: 'john.doe@taskly.app',
  phoneNumber: '+33 6 12 34 56 78',
  timezone: 'Europe/Paris (UTC+1)',
  country: 'France',
  city: 'Paris',
  postcode: '75011',
  state: 'Île-de-France',
  language: 'Français',
};

/** LibraryUI – Settings Profile (used as the Settings page of Taskly). */
@Component({
  selector: 'app-settings-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.scss']
})
export class SettingsProfileComponent {
  readonly theme = inject(ThemeService);
  readonly projects = inject(ProjectService);
  private readonly toast = inject(ToastService);

  readonly teamFilters = TEAM_FILTERS;
  activeSection = signal('informations-générales');
  readonly avatar = signal(DEFAULT_AVATAR);

  settingsTabs: SettingsTab[] = [
    { icon: 'info', label: 'Informations générales', active: true },
    { icon: 'sliders', label: 'Préférences' },
    { icon: 'shield', label: 'Sécurité' },
    { icon: 'bell', label: 'Notifications' },
    { icon: 'user-circle', label: 'Compte' },
    { icon: 'users', label: 'Membres & Rôles' },
    { icon: 'credit-card', label: 'Facturation' },
  ];

  form = { ...DEFAULT_FORM };

  notifications: NotificationPref[] = [
    { key: 'deadline', title: 'Rappels d’échéances', description: 'Recevoir un e-mail 48h avant l’échéance d’un projet.', enabled: true },
    { key: 'delayed', title: 'Alertes retard', description: 'Être notifié dès qu’un projet passe en retard.', enabled: true },
    { key: 'digest', title: 'Récapitulatif hebdomadaire', description: 'Un résumé de l’activité chaque lundi matin.', enabled: false },
  ];

  user = {
    name: 'John Doe',
    role: 'Chef de projet',
    location: 'Paris, France',
  };

  readonly activeTabLabel = computed(
    () => this.settingsTabs.find((t) => this.slug(t.label) === this.activeSection())?.label ?? '',
  );

  constructor() {
    this.restore();
  }

  setSection(label: string) {
    this.activeSection.set(this.slug(label));
    this.settingsTabs.forEach(t => t.active = t.label === label);
  }

  save() {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          form: this.form,
          avatar: this.avatar(),
          notifications: this.notifications.map((n) => ({ key: n.key, enabled: n.enabled })),
        }),
      );
      this.toast.show('Paramètres enregistrés avec succès');
    } catch {
      this.toast.show('Impossible d’enregistrer les paramètres', { tone: 'danger' });
    }
  }

  cancel() {
    this.restore();
    this.toast.show('Modifications annulées', { tone: 'info' });
  }

  onPhoto(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 1_500_000) {
      this.toast.show('Veuillez choisir une image de moins de 1,5 Mo', { tone: 'danger' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.avatar.set(String(reader.result));
    reader.readAsDataURL(file);
  }

  deletePhoto() {
    this.avatar.set(DEFAULT_AVATAR);
  }

  private restore() {
    this.form = { ...DEFAULT_FORM };
    this.avatar.set(DEFAULT_AVATAR);
    this.notifications.forEach((n, i) => (n.enabled = [true, true, false][i]));
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      this.form = { ...DEFAULT_FORM, ...saved.form };
      if (saved.avatar) this.avatar.set(saved.avatar);
      for (const s of saved.notifications ?? []) {
        const n = this.notifications.find((x) => x.key === s.key);
        if (n) n.enabled = !!s.enabled;
      }
    } catch {
      /* ignore corrupted storage */
    }
  }

  private slug(label: string): string {
    return label.toLowerCase().replace(/\s+/g, '-');
  }
}
