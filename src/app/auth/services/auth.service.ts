// src/app/auth/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { LoginCredentials } from '../models/signup-credentials.model';
import { SignupCredentials } from '../models/login-credentials.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token'; // Key for storing the token in localStorage
  
  // Mock users for demo
  private mockUsers = [
    {
      id: '1',
      username: 'AAA',
      email: 'AAA@gmail.com',
      password: 'AAAAAAAA'
    },
    {
      id: '2',
      username: 'demo',
      email: 'demo@example.com',
      password: 'password123'
    }
  ];

  constructor(private router: Router) {
    this.initializeAuthentication();
  }

  // Initialize authentication state from localStorage
  private initializeAuthentication(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        // token validation here
        // For mock implementation, we'll just parse the stored user data
        const userData = JSON.parse(atob(token.split('.')[1])); // Simple JWT-like structure
        this.currentUserSubject.next(userData);
      } catch (error) {
        // If token is invalid, clear it
        console.error('Invalid token found:', error);
        localStorage.removeItem(this.tokenKey);
      }
    }
  }

  // Login user with credentials returns observable with user info or error
  login(credentials: LoginCredentials): Observable<User> {
    // Find user with matching username (case insensitive) and password
    const matchingUser = this.mockUsers.find(u => 
      u.username.toLowerCase() === credentials.username.toLowerCase() && 
      u.password === credentials.password
    );
    
    if (!matchingUser) {
      return throwError(() => new Error('Invalid username or password'));
    }
    
    // Create user object without password
    const { password, ...user } = matchingUser;
    
    // Create a simple mock token (JWT-like structure)
    const token = this.createMockToken(user);
    
    return of(user).pipe(
      delay(800), // Simulate network delay
      tap(() => {
        // Store token if rememberMe is true or undefined (default to true)
        if (credentials.rememberMe !== false) {
          localStorage.setItem(this.tokenKey, token);
        } else {
          // For session-only storage, we could use sessionStorage
          // but for simplicity in this demo, we'll still use localStorage
          localStorage.setItem(this.tokenKey, token);
        }
        
        this.currentUserSubject.next(user);
      })
    );
  }

  //Register a new user and return Observable with new user or error
  signup(credentials: SignupCredentials): Observable<User> {
    // Check if username already exists (case insensitive)
    if (this.mockUsers.some(u => u.username.toLowerCase() === credentials.username.toLowerCase())) {
      return throwError(() => new Error('Username already taken'));
    }
    
    // Check if email already exists (case insensitive)
    if (this.mockUsers.some(u => u.email.toLowerCase() === credentials.email.toLowerCase())) {
      return throwError(() => new Error('Email already registered'));
    }
    
    // Create new user
    const newUser = {
      id: (this.mockUsers.length + 1).toString(),
      username: credentials.username,
      email: credentials.email,
      password: credentials.password
    };
    
    // Add to mock users
    this.mockUsers.push(newUser);
    
    // Return user without password
    const { password, ...user } = newUser;
    
    // Create a simple mock token
    const token = this.createMockToken(user);
    
    return of(user).pipe(
      delay(1200), // Simulate network delay
      tap(() => {
        localStorage.setItem(this.tokenKey, token);
        this.currentUserSubject.next(user);
      })
    );
  }

  // Logout the current user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Get current user value without subscribing to the observable
  // getCurrentUser(): User | null {
  //   return this.currentUserSubject.value;
  // }
  
  // Create a simple mock JWT token with user data
  private createMockToken(user: any): string {
    // Create a simple three-part token (header.payload.signature)
    const header = btoa(JSON.stringify({ alg: 'mock', typ: 'JWT' }));
    const payload = btoa(JSON.stringify(user));
    const signature = btoa('mocksignature');
    
    return `${header}.${payload}.${signature}`;
  }
}