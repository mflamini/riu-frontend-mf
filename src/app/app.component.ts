import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SpinnerService } from './services/spinner/spinner.service';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SpinnerComponent],
  template: `
    <router-outlet></router-outlet>

    @if (spinnerService.loading$ | async) {
    <div class="global-loading">
      <app-spinner></app-spinner>
    </div>
    }
  `,
  styles: [
    `
      .global-loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
    `,
  ],
})
export class AppComponent {
  spinnerService = inject(SpinnerService);
}
