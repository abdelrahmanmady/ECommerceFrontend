import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

interface FieldErrors {
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
  email: string | null;
  phoneNumber: string | null;
  password: string | null;
  confirmPassword: string | null;
  agreeTerms: string | null;
}

interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasDigit: boolean;
}

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  showPassword = false;
  isSubmitting = false;
  firstName = '';
  lastName = '';
  userName = '';
  email = '';
  phoneNumber = '';
  password = '';
  confirmPassword = '';
  agreeTerms = false;

  errors: FieldErrors = {
    firstName: null,
    lastName: null,
    userName: null,
    email: null,
    phoneNumber: null,
    password: null,
    confirmPassword: null,
    agreeTerms: null
  };

  passwordRequirements: PasswordRequirements = {
    minLength: false,
    hasUppercase: false,
    hasDigit: false
  };

  constructor(
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) { }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  validateFirstName(): void {
    this.errors.firstName = this.validateNameField(this.firstName, 'First name');
  }

  validateLastName(): void {
    this.errors.lastName = this.validateNameField(this.lastName, 'Last name');
  }

  validateUserName(): void {
    if (!this.userName) {
      this.errors.userName = null;
      return;
    }
    this.errors.userName = !this.userName.trim() ? 'Username is required' : null;
  }

  validateEmailField(): void {
    if (!this.email) {
      this.errors.email = null;
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.errors.email = !emailRegex.test(this.email) ? 'Please enter a valid email address' : null;
  }

  validatePhoneField(): void {
    if (!this.phoneNumber) {
      this.errors.phoneNumber = null;
      return;
    }
    const digitsOnly = this.phoneNumber.replace(/\s/g, '');
    const validPrefixes = ['10', '11', '12', '15'];
    const hasValidPrefix = validPrefixes.some(prefix => digitsOnly.startsWith(prefix));
    this.errors.phoneNumber = (!/^\d+$/.test(digitsOnly) || digitsOnly.length !== 10 || !hasValidPrefix)
      ? 'Please enter a valid phone number' : null;
  }

  checkPasswordRequirements(): void {
    this.passwordRequirements = {
      minLength: this.password.length >= 8,
      hasUppercase: /[A-Z]/.test(this.password),
      hasDigit: /[0-9]/.test(this.password)
    };

    if (!this.password) {
      this.errors.password = null;
    } else if (!this.passwordRequirements.minLength || !this.passwordRequirements.hasUppercase || !this.passwordRequirements.hasDigit) {
      this.errors.password = 'Password does not meet all requirements';
    } else {
      this.errors.password = null;
    }

    if (this.confirmPassword) {
      this.validateConfirmPasswordField();
    }
  }

  validateConfirmPasswordField(): void {
    if (!this.confirmPassword) {
      this.errors.confirmPassword = null;
      return;
    }
    this.errors.confirmPassword = this.password !== this.confirmPassword ? 'Passwords do not match' : null;
  }

  private validateNameField(value: string, fieldName: string): string | null {
    if (!value) return null;
    if (!value.trim()) return `${fieldName} is required`;
    if (/[\d\s]/.test(value)) return `${fieldName} cannot contain numbers or spaces`;
    return null;
  }

  private validatePhoneForSubmit(): string | null {
    const digitsOnly = this.phoneNumber.replace(/\s/g, '');
    const validPrefixes = ['10', '11', '12', '15'];
    const hasValidPrefix = validPrefixes.some(prefix => digitsOnly.startsWith(prefix));
    return (!/^\d+$/.test(digitsOnly) || digitsOnly.length !== 10 || !hasValidPrefix)
      ? 'Please enter a valid phone number' : null;
  }

  private validateForm(): boolean {
    this.errors = {
      firstName: !this.firstName?.trim() ? 'First name is required' : this.validateNameField(this.firstName, 'First name'),
      lastName: !this.lastName?.trim() ? 'Last name is required' : this.validateNameField(this.lastName, 'Last name'),
      userName: !this.userName?.trim() ? 'Username is required' : null,
      email: !this.email?.trim() ? 'Email is required' : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) ? 'Please enter a valid email address' : null),
      phoneNumber: this.phoneNumber ? this.validatePhoneForSubmit() : null,
      password: !this.password ? 'Password is required' : (!this.passwordRequirements.minLength || !this.passwordRequirements.hasUppercase || !this.passwordRequirements.hasDigit ? 'Password does not meet all requirements' : null),
      confirmPassword: this.password !== this.confirmPassword ? 'Passwords do not match' : null,
      agreeTerms: !this.agreeTerms ? 'You must agree to the terms' : null
    };
    return !Object.values(this.errors).some(error => error !== null);
  }

  private mapErrorToField(key: string): keyof FieldErrors | null {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('firstname')) return 'firstName';
    if (lowerKey.includes('lastname')) return 'lastName';
    if (lowerKey.includes('username')) return 'userName';
    if (lowerKey.includes('email')) return 'email';
    if (lowerKey.includes('phone')) return 'phoneNumber';
    if (lowerKey.includes('password')) return 'password';
    return null;
  }

  private handleApiErrors(error: HttpErrorResponse): void {
    const detail = error.error?.detail;
    if (!detail || typeof detail !== 'string') {
      this.toastr.error('Registration failed. Please try again.');
      return;
    }

    const errorParts = detail.split(';').filter((part: string) => part.trim());
    let mappedAnyError = false;

    for (const part of errorParts) {
      const colonIndex = part.indexOf(':');
      if (colonIndex === -1) continue;
      const key = part.substring(0, colonIndex).trim();
      const message = part.substring(colonIndex + 1).trim();
      const fieldName = this.mapErrorToField(key);
      if (fieldName) {
        this.errors[fieldName] = message;
        mappedAnyError = true;
      }
    }

    if (!mappedAnyError) {
      this.toastr.error(error.error?.message || 'Registration failed. Please try again.');
    }
  }

  register(form: NgForm): void {
    this.errors = {
      firstName: null, lastName: null, userName: null, email: null,
      phoneNumber: null, password: null, confirmPassword: null, agreeTerms: null
    };

    if (!this.validateForm()) return;

    this.isSubmitting = true;
    const phoneDigits = this.phoneNumber?.replace(/\s/g, '') || '';
    const fullPhoneNumber = phoneDigits.length > 0 ? '20' + phoneDigits : null;

    this.authService.register({
      firstName: this.firstName,
      lastName: this.lastName,
      userName: this.userName,
      email: this.email,
      phoneNumber: fullPhoneNumber ?? undefined,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.authService.setAuthState(res);
        this.isSubmitting = false;
        this.toastr.success('Registration successful! Welcome!');
        this.router.navigate(['/home']);
      },
      error: (error: HttpErrorResponse) => {
        setTimeout(() => {
          this.isSubmitting = false;
          try {
            this.handleApiErrors(error);
          } catch {
            this.toastr.error('Registration failed. Please try again.');
          }
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }
}
