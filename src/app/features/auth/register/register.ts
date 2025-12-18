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

  // Form field values
  firstName = '';
  lastName = '';
  userName = '';
  email = '';
  phoneNumber = '';
  password = '';
  confirmPassword = '';
  agreeTerms = false;

  // Field-level errors
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

  // Password requirements tracking
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

  // Real-time validation for first name
  validateFirstName(): void {
    this.errors.firstName = this.validateNameField(this.firstName, 'First name');
  }

  // Real-time validation for last name
  validateLastName(): void {
    this.errors.lastName = this.validateNameField(this.lastName, 'Last name');
  }

  // Real-time validation for username
  validateUserName(): void {
    if (!this.userName) {
      this.errors.userName = null;
      return;
    }
    this.errors.userName = !this.userName.trim() ? 'Username is required' : null;
  }

  // Real-time validation for email
  validateEmailField(): void {
    if (!this.email) {
      this.errors.email = null;
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errors.email = 'Please enter a valid email address';
    } else {
      this.errors.email = null;
    }
  }

  // Real-time validation for phone
  validatePhoneField(): void {
    if (!this.phoneNumber) {
      this.errors.phoneNumber = null;
      return;
    }
    const digitsOnly = this.phoneNumber.replace(/\s/g, '');
    const validPrefixes = ['10', '11', '12', '15'];
    const hasValidPrefix = validPrefixes.some(prefix => digitsOnly.startsWith(prefix));

    if (!/^\d+$/.test(digitsOnly) || digitsOnly.length !== 10 || !hasValidPrefix) {
      this.errors.phoneNumber = 'Please enter a valid phone number';
    } else {
      this.errors.phoneNumber = null;
    }
  }

  // Check password requirements as user types
  checkPasswordRequirements(): void {
    this.passwordRequirements = {
      minLength: this.password.length >= 8,
      hasUppercase: /[A-Z]/.test(this.password),
      hasDigit: /[0-9]/.test(this.password)
    };

    // Validate password field
    if (!this.password) {
      this.errors.password = null;
    } else if (!this.passwordRequirements.minLength ||
      !this.passwordRequirements.hasUppercase ||
      !this.passwordRequirements.hasDigit) {
      this.errors.password = 'Password does not meet all requirements';
    } else {
      this.errors.password = null;
    }

    // Also check confirm password if it has value
    if (this.confirmPassword) {
      this.validateConfirmPasswordField();
    }
  }

  // Real-time validation for confirm password
  validateConfirmPasswordField(): void {
    if (!this.confirmPassword) {
      this.errors.confirmPassword = null;
      return;
    }
    this.errors.confirmPassword = this.password !== this.confirmPassword
      ? 'Passwords do not match'
      : null;
  }

  // Validate name fields (no numbers, no spaces)
  private validateNameField(value: string, fieldName: string): string | null {
    if (!value) return null; // Don't show error while empty
    if (!value.trim()) {
      return `${fieldName} is required`;
    }
    if (/[\d\s]/.test(value)) {
      return `${fieldName} cannot contain numbers or spaces`;
    }
    return null;
  }

  // Validate phone for submit
  private validatePhoneForSubmit(): string | null {
    const digitsOnly = this.phoneNumber.replace(/\s/g, '');
    const validPrefixes = ['10', '11', '12', '15'];
    const hasValidPrefix = validPrefixes.some(prefix => digitsOnly.startsWith(prefix));

    if (!/^\d+$/.test(digitsOnly) || digitsOnly.length !== 10 || !hasValidPrefix) {
      return 'Please enter a valid phone number';
    }
    return null;
  }

  // Run all client-side validations for submit
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

  // Map API error key to form field
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

  // Parse API error detail and map to form fields
  private handleApiErrors(error: HttpErrorResponse): void {
    const detail = error.error?.detail;
    if (!detail || typeof detail !== 'string') {
      this.toastr.error('Registration failed. Please try again.');
      return;
    }

    // Parse "Key: Message; Key2: Message2;" format
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

    // If no errors could be mapped, show a toast with the full detail
    if (!mappedAnyError) {
      this.toastr.error(error.error?.message || 'Registration failed. Please try again.');
    }
  }

  register(form: NgForm): void {
    // Clear previous errors
    this.errors = {
      firstName: null,
      lastName: null,
      userName: null,
      email: null,
      phoneNumber: null,
      password: null,
      confirmPassword: null,
      agreeTerms: null
    };

    // Run client-side validation
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    // Prepare phone number (strip spaces, add country code, or null if empty)
    const phoneDigits = this.phoneNumber?.replace(/\s/g, '') || '';
    const fullPhoneNumber = phoneDigits.length > 0 ? '20' + phoneDigits : null;

    this.authService.register(
      this.firstName,
      this.lastName,
      this.userName,
      this.email,
      fullPhoneNumber,
      this.password
    ).subscribe({
      next: () => {
        // Use setTimeout to avoid NG0100 (ExpressionChangedAfterItHasBeenCheckedError)
        setTimeout(() => {
          this.isSubmitting = false;
          this.toastr.success('Registration successful! Please login.');
          this.router.navigate(['/login']);
        }, 0);
      },
      error: (error: HttpErrorResponse) => {
        // Use setTimeout to avoid NG0100 and ensure UI updates
        setTimeout(() => {
          this.isSubmitting = false;
          try {
            this.handleApiErrors(error);
          } catch (e) {
            this.toastr.error('Registration failed. Please try again.');
          }
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }
}
