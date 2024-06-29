import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication/authentication.service';

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  if (authService.is_logged_in()) {
    const reqWithToken = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${authService.$state().jwt}`
      ),
    });
    return next(reqWithToken);
  } else {
    return next(req);
  }
};
