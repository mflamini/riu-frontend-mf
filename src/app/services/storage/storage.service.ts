import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private platformId = inject(PLATFORM_ID);
  private _isBrowser = isPlatformBrowser(this.platformId);

  getItem(key: string): string | null {
    if (!this._isBrowser) return null;
    const item = localStorage.getItem(key);
    return item !== null ? item : null;
  }

  setItem(key: string, value: string): void {
    if (this._isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  removeItem(key: string): void {
    if (this._isBrowser) {
      localStorage.removeItem(key);
    }
  }
}
