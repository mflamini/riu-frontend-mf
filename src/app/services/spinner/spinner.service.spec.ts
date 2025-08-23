import { TestBed } from '@angular/core/testing';
import { SpinnerService } from './spinner.service';
import { take } from 'rxjs/operators';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpinnerService],
    });

    service = TestBed.inject(SpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial loading state as false', (done) => {
    service.loading$.pipe(take(1)).subscribe((state) => {
      expect(state).toBeFalse();
      done();
    });
  });

  it('should set loading state to true when show() is called', (done) => {
    service.show();
    service.loading$.pipe(take(1)).subscribe((state) => {
      expect(state).toBeTrue();
      done();
    });
  });

  it('should set loading state to false when hide() is called', (done) => {
    service.show();
    service.hide();
    service.loading$.pipe(take(1)).subscribe((state) => {
      expect(state).toBeFalse();
      done();
    });
  });
});
