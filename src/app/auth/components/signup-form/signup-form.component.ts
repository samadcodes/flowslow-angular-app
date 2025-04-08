// src/app/auth/components/signup-form/signup-form.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-form.component.html',
  styleUrls: ['.././form-styles.scss']
})
export class SignupFormComponent {
  @Output() signupSuccess = new EventEmitter<void>();
  
  signupForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  authError: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      agreeTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }
  
  passwordMatchValidator(group: FormGroup): {[key: string]: any} | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }
  
  showErrors(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
  
  showPasswordMismatchError(): boolean {
    const confirmPasswordControl = this.signupForm.get('confirmPassword');
    if (!confirmPasswordControl?.dirty && !confirmPasswordControl?.touched) {
      return false;
    }
    
    return this.signupForm.hasError('passwordMismatch') && confirmPasswordControl?.value !== '';
  }
  
  onSubmit(): void {
    if (this.signupForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    this.authError = null;
    
    const credentials = {
      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    };
    
    this.authService.signup(credentials)
      .pipe(
        catchError(error => {
          this.authError = error.message || 'Signup failed. Please try again.';
          throw error;
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: () => {
          // Emit success event to parent component
          this.signupSuccess.emit();
        },
        error: () => {
          // Error already handled in catchError
        }
      });
  }
}