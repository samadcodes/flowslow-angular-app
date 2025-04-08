// src/app/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { AuthPageComponent } from './components/auth-page/auth-page.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'auth',
    component: AuthPageComponent
  }
];