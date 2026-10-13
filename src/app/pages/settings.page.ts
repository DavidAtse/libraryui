import { Component } from '@angular/core';
import { SettingsProfileComponent } from '../libraryui/settings-profile/settings-profile.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [SettingsProfileComponent],
  template: `<section class="page"><app-settings-profile /></section>`,
})
export class SettingsPage {}
