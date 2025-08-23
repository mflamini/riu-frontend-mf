import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import {
  AuthService,
  LoginCredentials,
} from '../../services/auth-service/auth.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const routeMock = {
      snapshot: { queryParams: {} },
    } as any as ActivatedRoute;

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set returnUrl from query params', () => {
    const route = TestBed.inject(ActivatedRoute);
    route.snapshot.queryParams['returnUrl'] = '/custom';
    component.ngOnInit();
    expect(component.returnUrl).toBe('/custom');
  });

  it('should mark form controls as touched if form invalid on submit', () => {
    component.loginForm.setValue({ username: '', password: '' });
    component.onSubmit();
    const touched = Object.values(component.loginForm.controls).every(
      (c) => c.touched
    );
    expect(touched).toBeTrue();
  });

  it('should login successfully and navigate', fakeAsync(() => {
    const credentials: LoginCredentials = {
      username: 'admin',
      password: 'admin123',
    };
    authServiceSpy.login.and.returnValue(of({ success: true }));
    component.loginForm.setValue(credentials);

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith(credentials);
    expect(component.isLoading).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith([component.returnUrl]);
    expect(component.errorMessage).toBe('');
  }));

  it('should show error message if login fails', fakeAsync(() => {
    const credentials: LoginCredentials = {
      username: 'admin',
      password: 'wrong',
    };
    authServiceSpy.login.and.returnValue(
      of({ success: false, message: 'Credenciales inválidas' })
    );
    component.loginForm.setValue(credentials);

    component.onSubmit();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('Credenciales inválidas');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));

  it('should show error message on login error', fakeAsync(() => {
    const credentials: LoginCredentials = {
      username: 'admin',
      password: 'admin123',
    };
    authServiceSpy.login.and.returnValue(
      throwError(() => new Error('Network error'))
    );
    component.loginForm.setValue(credentials);

    component.onSubmit();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe(
      'Error de conexión. Intente nuevamente.'
    );
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));

  it('should show username error message when touched and invalid', () => {
    const usernameControl = component.loginForm.controls['username'];
    usernameControl.setValue('');
    usernameControl.markAsTouched();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorEl = compiled.querySelector('.input-field .error-message');
    expect(errorEl?.textContent).toContain('El usuario es requerido');
  });

  it('should show password error message when touched and invalid', () => {
    const passwordControl = component.loginForm.controls['password'];
    passwordControl.setValue('');
    passwordControl.markAsTouched();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorEls = compiled.querySelectorAll('.input-field .error-message');
    const passwordError = Array.from(errorEls).find((el) =>
      el.textContent?.includes('La contraseña es requerida')
    );
    expect(passwordError).toBeTruthy();
  });

  it('should display loading spinner when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const spinner = compiled.querySelector('.loading-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should display general error message if errorMessage is set', () => {
    component.errorMessage = 'Error de prueba';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const generalError = compiled.querySelector('.error-message:last-child');
    expect(generalError?.textContent).toContain('Error de prueba');
  });

  it('submit button should be disabled while loading', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  });

  it('submit button should be enabled when not loading', () => {
    component.isLoading = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    expect(button.disabled).toBeFalse();
  });
});
