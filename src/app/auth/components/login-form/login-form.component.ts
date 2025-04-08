// src/app/auth/components/login-form/login-form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['.././form-styles.scss']
})
export class LoginFormComponent {
  @Input() returnUrl: string = '/';
  @Output() loginSuccess = new EventEmitter<void>();
  
  loginForm: FormGroup;
  showPassword = false;
  isSubmitting = false;
  authError: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [true]
    });
  }
  
  showErrors(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    this.authError = null;
    
    const credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
      rememberMe: this.loginForm.value.rememberMe
    };
    
    this.authService.login(credentials)
      .pipe(
        catchError(error => {
          this.authError = error.message || 'Login failed. Please check your credentials.';
          throw error;
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: () => {
          // Emit success event to parent component
          this.loginSuccess.emit();
        },
        error: () => {
          // Error already handled in catchError
        }
      });
  }
}