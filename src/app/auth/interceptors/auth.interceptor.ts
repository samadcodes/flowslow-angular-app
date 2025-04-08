// src/app/auth/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get token from local storage
    const token = localStorage.getItem('auth_token');
    
    // If token exists, clone the request and add the authorization header
    if (token) {
      request = this.addToken(request, token);
    }

    // Pass the request to the next handler
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors by logging out the user
        if (error.status === 401) {
          // Only logout if not currently trying to refresh the token
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.authService.logout();
            this.router.navigate(['/auth']);
          }
        }
        
        return throwError(() => error);
      })
    );
  }
  
  // Add authorization token to the request
  private addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}