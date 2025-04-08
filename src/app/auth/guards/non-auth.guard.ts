// src/app/auth/guards/non-auth.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

// This guard prevents authenticated users from accessing login/signup pages

@Injectable({
  providedIn: 'root'
})
export class NonAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      return true;
    }
    
    // If user is already logged in, redirect to home
    this.router.navigate(['/']);
    return false;
  }
}