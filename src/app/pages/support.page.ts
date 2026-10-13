import { Component } from '@angular/core';
import { ContactMavix } from '../libraryui/contact-mavix/contact-mavix.component';

@Component({
  selector: 'app-support-page',
  standalone: true,
  imports: [ContactMavix],
  template: `<section class="page"><app-contact-mavix /></section>`,
})
export class SupportPage {}
