// src/app/auth/components/auth-page/auth-page.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginFormComponent } from '../login-form/login-form.component';
import { SignupFormComponent } from '../signup-form/signup-form.component';
import { TypewriterTextComponent } from '../typewriter-text/typewriter-text.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginFormComponent,
    SignupFormComponent,
    TypewriterTextComponent
  ],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  returnUrl: string = '/';
  inspirationalTexts: string[] = [
    "time blindness and imposter syndrome, flowslow will help you gain back control of your time.",
    "hours turn into days, days into weeks, months and years... note down your activities and reflect later to absorb the time run.",
    // "you lose the track of time in corporate, right? your time your right",
    "adulthood is hard, specially when you don't understand where your time goes, track your time, track YOUR life.",
    "busy does not mean productive, slow down, reflect, be intentional with your time.",
    "what gets measured gets managed, know where your time goes, take back control.",
    "your time is finite, make each hour count, reflect and improve."
  ];
  currentTextIndex = 0;
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }

    // Subscribe to auth state changes
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          // Navigate to return url when user logs in
          this.router.navigate([this.returnUrl]);
        }
      })
    );

    // Switch to signup mode if url has signup param
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'signup') {
        this.isLoginMode = false;
      } else {
        this.isLoginMode = true;
      }
    });

    // Rotate through texts every 10 seconds
    setInterval(() => {
      this.currentTextIndex = (this.currentTextIndex + 1) % this.inspirationalTexts.length;
    }, 10000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleAuthMode(): void {
    this.isLoginMode = !this.isLoginMode;

    const queryParams = this.isLoginMode ? { mode: 'login' } : { mode: 'signup' };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  onLoginSuccess(): void {
    this.router.navigate([this.returnUrl]);
  }

  onSignupSuccess(): void {
    this.router.navigate(['/']);
  }
}