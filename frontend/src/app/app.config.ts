import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideToastr } from 'ngx-toastr';

import { addTokenInterceptor } from './add-token.interceptor';
import { routes } from './app.routes';
import { AuthenticationService } from './authentication/authentication.service';

const bootstrap = () => {
  const authService = inject(AuthenticationService);
  return () => {
    const persisted_data = localStorage.getItem('record');
    if (persisted_data) {
      authService.$state.set(JSON.parse(persisted_data));
    }
  };
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([ addTokenInterceptor ])),
    provideToastr(),
    { provide: APP_INITIALIZER, multi: true, useFactory: bootstrap },
  ],
};
