import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { SpinnerService } from '../services/spinner/spinner.service';

export const SpinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(SpinnerService);

  console.log('[Interceptor] Request started:', req.url);
  spinnerService.show();

  return next(req).pipe(
    finalize(() => {
      console.log('[Interceptor] Request finished:', req.url);
      spinnerService.hide();
    })
  );
};
