// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AppContainerComponent } from './components/app-container/app-container.component';
import { AuthPageComponent } from './auth/components/auth-page/auth-page.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { NonAuthGuard } from './auth/guards/non-auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthPageComponent,
    canActivate: [NonAuthGuard]
  },
  {
    path: 'login',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'signup',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AppContainerComponent,
    canActivate: [AuthGuard]
  },
  
  {
    path: '**',
    redirectTo: 'auth'
  }
];