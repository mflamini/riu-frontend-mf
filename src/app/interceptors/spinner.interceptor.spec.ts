import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { SpinnerInterceptor } from './spinner.interceptor';
import { SpinnerService } from '../services/spinner/spinner.service';

describe('SpinnerInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let spinnerService: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SpinnerService,
        provideHttpClient(withInterceptors([SpinnerInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    spinnerService = TestBed.inject(SpinnerService);

    spyOn(spinnerService, 'show').and.callThrough();
    spyOn(spinnerService, 'hide').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call show and hide when making a request', fakeAsync(() => {
    http.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(spinnerService.show).toHaveBeenCalled();

    req.flush({});
    tick();

    expect(spinnerService.hide).toHaveBeenCalled();
  }));

  it('should hide even if request errors', fakeAsync(() => {
    http.get('/error').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/error');
    expect(spinnerService.show).toHaveBeenCalled();

    req.flush('Network error', { status: 500, statusText: 'Server Error' });
    tick();

    expect(spinnerService.hide).toHaveBeenCalled();
  }));
});
