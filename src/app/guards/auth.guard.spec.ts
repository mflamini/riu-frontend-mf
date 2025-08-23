import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard, LoginGuard, RoleGuard } from './auth.guard';
import { AuthService } from '../services/auth-service/auth.service';
import { of } from 'rxjs';

describe('Guards', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/test' } as RouterStateSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'hasRole',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        LoginGuard,
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  describe('AuthGuard', () => {
    let guard: AuthGuard;

    beforeEach(() => {
      guard = TestBed.inject(AuthGuard);
    });

    it('should allow if authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      expect(guard.canActivate(mockRoute, mockState)).toBeTrue();
    });

    it('should redirect to /login if not authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      const result = guard.canActivate(mockRoute, mockState);
      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '/test' },
      });
    });
  });

  describe('LoginGuard', () => {
    let guard: LoginGuard;

    beforeEach(() => {
      guard = TestBed.inject(LoginGuard);
    });

    it('should allow if not authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      expect(guard.canActivate()).toBeTrue();
    });

    it('should redirect to /dashboard if authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      expect(guard.canActivate()).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('RoleGuard', () => {
    let guard: RoleGuard;

    beforeEach(() => {
      guard = TestBed.inject(RoleGuard);
    });

    it('should allow if no role required', () => {
      const route = { data: {} } as ActivatedRouteSnapshot;
      expect(guard.canActivate(route)).toBeTrue();
    });

    it('should allow if no role required', () => {
      const route = { data: {} } as unknown as ActivatedRouteSnapshot;
      expect(guard.canActivate(route)).toBeTrue();
    });

    it('should redirect to /login if not authenticated', () => {
      const route = {
        data: { role: 'ADMIN' },
      } as unknown as ActivatedRouteSnapshot;
      authServiceSpy.isAuthenticated.and.returnValue(false);

      expect(guard.canActivate(route)).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should allow if authenticated and has role', () => {
      const route = {
        data: { role: 'ADMIN' },
      } as unknown as ActivatedRouteSnapshot;
      authServiceSpy.isAuthenticated.and.returnValue(true);
      authServiceSpy.hasRole.and.returnValue(true);

      expect(guard.canActivate(route)).toBeTrue();
    });

    it('should redirect to /unauthorized if authenticated but wrong role', () => {
      const route = {
        data: { role: 'ADMIN' },
      } as unknown as ActivatedRouteSnapshot;
      authServiceSpy.isAuthenticated.and.returnValue(true);
      authServiceSpy.hasRole.and.returnValue(false);

      expect(guard.canActivate(route)).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/unauthorized']);
    });
  });
});
