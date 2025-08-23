import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { SpinnerService } from '../../../services/spinner/spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading$ | async) {
    <div class="spinner-overlay">
      <div class="spinner-container">
        <div class="spinner"></div>
        <p class="spinner-text">Cargando...</p>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .spinner-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
      }

      .spinner-container {
        text-align: center;
        color: #fff;
      }

      .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(158, 67, 228, 0.3);
        border-top: 4px solid #9e43e4;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      }

      .spinner-text {
        margin: 0;
        font-size: 16px;
        opacity: 0.9;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  ],
})
export class SpinnerComponent {
  private _spinnerService = inject(SpinnerService);
  loading$: Observable<boolean>;

  constructor() {
    this.loading$ = this._spinnerService.loading$;
    this.loading$.subscribe((value) =>
      console.log('[SpinnerComponent] loading =', value)
    );
  }
}
