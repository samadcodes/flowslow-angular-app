// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AppContainerComponent } from './components/app-container/app-container.component';

export const routes: Routes = [
  {
    path: '',
    component: AppContainerComponent
  },
  // Add additional routes here as your app grows
  {
    path: '**',
    redirectTo: ''
  }
];