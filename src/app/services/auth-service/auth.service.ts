import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _storage = inject(StorageService);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private mockUsers: User[] = [
    { id: 1, username: 'admin', email: 'admin@test.com', role: 'admin' },
    { id: 2, username: 'user', email: 'user@test.com', role: 'user' },
    { id: 3, username: 'demo', email: 'demo@test.com', role: 'user' },
  ];

  private validCredentials = [
    { username: 'admin', password: 'admin123' },
    { username: 'user', password: 'user123' },
    { username: 'demo', password: 'demo123' },
  ];

  constructor() {
    const savedUser = this._storage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(
    credentials: LoginCredentials
  ): Observable<{ success: boolean; user?: User; message?: string }> {
    return of(credentials).pipe(
      delay(1000),
      map((creds) => {
        const validCred = this.validCredentials.find(
          (c) => c.username === creds.username && c.password === creds.password
        );

        if (validCred) {
          const user = this.mockUsers.find(
            (u) => u.username === creds.username
          );
          if (user) {
            this._storage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return { success: true, user, message: 'Login exitoso' };
          }
        }
        return { success: false, message: 'Credenciales inválidas' };
      })
    );
  }

  logout(): void {
    this._storage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }
}
