import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LoadingInterceptor } from './loading.interceptor';
import { LoadingService } from '../services/loading-service/loading.service';

describe('LoadingInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoadingService,
        provideHttpClient(withInterceptors([LoadingInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(LoadingService);

    spyOn(loadingService, 'show').and.callThrough();
    spyOn(loadingService, 'hide').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call show and hide when making a request', fakeAsync(() => {
    http.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(loadingService.show).toHaveBeenCalled();

    req.flush({});
    tick();

    expect(loadingService.hide).toHaveBeenCalled();
  }));

  it('should hide even if request errors', fakeAsync(() => {
    http.get('/error').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/error');
    expect(loadingService.show).toHaveBeenCalled();

    req.flush('Network error', { status: 500, statusText: 'Server Error' });
    tick();

    expect(loadingService.hide).toHaveBeenCalled();
  }));
});
