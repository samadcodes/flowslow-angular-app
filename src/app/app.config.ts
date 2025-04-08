// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';

export function authInterceptorFn(req: Request, next: any) {
  // const instance = new AuthInterceptor(/* dependencies would be injected here */);
  // return instance.intercept(req as any, next);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        // Add auth interceptor for future HTTP calls
        // For now this is commented out since we don't have the proper DI
        // authInterceptorFn
      ])
    )
  ]
};