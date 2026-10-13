import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/toast.service';

/** LibraryUI – Contact Mavix (adapted for Taskly support). */
@Component({
  selector: 'app-contact-mavix',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-mavix.component.html',
  styleUrls: ['./contact-mavix.component.scss']
})
export class ContactMavix {
  private readonly toast = inject(ToastService);

  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  message = '';
  sent = false;

  get validEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());
  }

  get valid(): boolean {
    return !!this.firstName.trim() && this.validEmail && !!this.message.trim();
  }

  send() {
    if (!this.valid) return;
    this.sent = true;
    this.toast.show('Votre message a bien été envoyé !');
  }

  reset() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phone = '';
    this.message = '';
    this.sent = false;
  }
}
