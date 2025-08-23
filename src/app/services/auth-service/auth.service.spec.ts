import { TestBed } from '@angular/core/testing';
import { AuthService, LoginCredentials, User } from './auth.service';
import { StorageService } from '../storage/storage.service';
import { PLATFORM_ID } from '@angular/core';
import { take } from 'rxjs/operators';

describe('AuthService', () => {
  let service: AuthService;
  let storageService: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        StorageService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    storageService = TestBed.inject(StorageService);
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully with valid credentials', (done) => {
    const creds: LoginCredentials = { username: 'admin', password: 'admin123' };

    spyOn(localStorage, 'setItem').and.callFake(() => {});

    service
      .login(creds)
      .pipe(take(1))
      .subscribe((res) => {
        expect(res.success).toBeTrue();
        expect(res.user?.username).toBe('admin');
        expect(service.isAuthenticated()).toBeTrue();
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'currentUser',
          jasmine.any(String)
        );
        done();
      });
  });

  it('should fail login with invalid credentials', (done) => {
    const creds: LoginCredentials = { username: 'admin', password: 'wrong' };

    service
      .login(creds)
      .pipe(take(1))
      .subscribe((res) => {
        expect(res.success).toBeFalse();
        expect(res.message).toBe('Credenciales inválidas');
        expect(service.isAuthenticated()).toBeFalse();
        done();
      });
  });

  it('should logout properly', () => {
    spyOn(localStorage, 'removeItem').and.callFake(() => {});
    service.logout();
    expect(service.getCurrentUser()).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');
  });

  it('should return current user correctly', () => {
    const user: User = {
      id: 1,
      username: 'test',
      email: 'test@test.com',
      role: 'admin',
    };
    (service as any).currentUserSubject.next(user);
    expect(service.getCurrentUser()).toEqual(user);
  });

  it('should return isAuthenticated correctly', () => {
    (service as any).currentUserSubject.next(null);
    expect(service.isAuthenticated()).toBeFalse();
    (service as any).currentUserSubject.next({
      id: 1,
      username: 'x',
      email: 'x@x.com',
      role: 'user',
    });
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should check hasRole correctly', () => {
    (service as any).currentUserSubject.next({
      id: 1,
      username: 'x',
      email: 'x@x.com',
      role: 'admin',
    });
    expect(service.hasRole('admin')).toBeTrue();
    expect(service.hasRole('user')).toBeFalse();
  });

  it('should fail login if credentials are valid but user not found', (done) => {
    (service as any).validCredentials.push({
      username: 'ghost',
      password: '123',
    });

    service.login({ username: 'ghost', password: '123' }).subscribe((res) => {
      expect(res.success).toBeFalse();
      expect(res.message).toBe('Credenciales inválidas');
      done();
    });
  });
});
