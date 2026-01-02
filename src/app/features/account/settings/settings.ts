import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService, AuthService } from '../../../core/services';
import { UserDetailsResponse } from '../../../core/models/user.model';
import { environment } from '../../../../environments/environment';

interface FieldErrors {
    firstName: string | null;
    lastName: string | null;
    userName: string | null;
    email: string | null;
    phoneNumber: string | null;
}

@Component({
    selector: 'app-account-settings',
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.html',
    styleUrl: './settings.css',
})
export class AccountSettings implements OnInit {
    private userService = inject(UserService);
    private authService = inject(AuthService);
    private toastr = inject(ToastrService);

    user = signal<UserDetailsResponse | null>(null);
    loading = signal(true);

    // Form fields
    firstName = '';
    lastName = '';
    userName = '';
    email = '';
    phoneNumber = '';

    // Validation errors
    errors: FieldErrors = {
        firstName: null,
        lastName: null,
        userName: null,
        email: null,
        phoneNumber: null
    };

    // Avatar
    avatarPreview = signal<string | null>(null);
    uploadingAvatar = signal(false);

    // Password fields
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';
    passwordError = signal<string | null>(null);
    updatingPassword = signal(false);
    passwordAttempted = signal(false);

    passwordRequirements = {
        minLength: false,
        hasUppercase: false,
        hasDigit: false
    };

    checkPasswordRequirements(): void {
        this.passwordRequirements = {
            minLength: this.newPassword.length >= 8,
            hasUppercase: /[A-Z]/.test(this.newPassword),
            hasDigit: /[0-9]/.test(this.newPassword)
        };
    }

    ngOnInit(): void {
        this.loadUser();
    }

    loadUser(): void {
        this.loading.set(true);
        this.userService.getUserDetails().subscribe({
            next: (res) => {
                this.user.set(res);
                this.firstName = res.firstName;
                this.lastName = res.lastName;
                this.userName = res.userName;
                this.email = res.email;
                // Strip '20' country code prefix if present
                let phone = res.phoneNumber || '';
                if (phone.startsWith('20')) {
                    phone = phone.substring(2);
                }
                this.phoneNumber = phone;
                if (res.avatarUrl) {
                    this.avatarPreview.set(`${environment.url}${res.avatarUrl}`);
                }
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    getInitials(): string {
        const first = this.firstName || this.user()?.firstName || '';
        const last = this.lastName || this.user()?.lastName || '';
        if (first && last) {
            return (first[0] + last[0]).toUpperCase();
        }
        return first.substring(0, 2).toUpperCase() || '?';
    }

    onAvatarSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];

            // Show preview immediately
            const reader = new FileReader();
            reader.onload = (e) => {
                this.avatarPreview.set(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to server
            this.uploadingAvatar.set(true);
            this.userService.uploadAvatar(file).subscribe({
                next: (res) => {
                    this.uploadingAvatar.set(false);
                    this.user.set(res);
                    if (res.avatarUrl) {
                        this.avatarPreview.set(`${environment.url}${res.avatarUrl}`);
                        this.authService.updateAvatarUrl(res.avatarUrl);
                    }
                    this.toastr.success('Photo updated successfully!');
                },
                error: () => {
                    this.uploadingAvatar.set(false);
                    // Revert preview on error
                    const originalAvatar = this.user()?.avatarUrl;
                    this.avatarPreview.set(originalAvatar ? `${environment.url}${originalAvatar}` : null);
                }
            });

            // Reset input so same file can be selected again
            input.value = '';
        }
    }

    removeAvatar(): void {
        if (this.uploadingAvatar()) return;

        this.uploadingAvatar.set(true);
        this.userService.deleteAvatar().subscribe({
            next: () => {
                this.uploadingAvatar.set(false);
                this.avatarPreview.set(null);
                this.authService.updateAvatarUrl(undefined);
                this.toastr.success('Photo removed successfully!');
            },
            error: () => {
                this.uploadingAvatar.set(false);
            }
        });
    }

    // ==================== Save Changes ====================

    saving = signal(false);

    saveChanges(): void {
        if (this.saving() || !this.validateForm()) return;

        this.saving.set(true);

        const phoneDigits = this.phoneNumber?.replace(/\s/g, '') || '';
        const fullPhoneNumber = phoneDigits.length > 0 ? '20' + phoneDigits : undefined;

        this.userService.updateUser({
            firstName: this.firstName,
            lastName: this.lastName,
            userName: this.userName,
            email: this.email,
            phoneNumber: fullPhoneNumber
        }).subscribe({
            next: (res) => {
                this.saving.set(false);
                this.authService.setAuthState(res);
                this.loadUser(); // Reload to get updated data
                this.toastr.success('Profile updated successfully!');
            },
            error: () => {
                this.saving.set(false);
            }
        });
    }

    private validateForm(): boolean {
        this.errors = {
            firstName: !this.firstName?.trim() ? 'First name is required' : this.validateNameField(this.firstName, 'First name'),
            lastName: !this.lastName?.trim() ? 'Last name is required' : this.validateNameField(this.lastName, 'Last name'),
            userName: !this.userName?.trim() ? 'Username is required' : null,
            email: !this.email?.trim() ? 'Email is required' : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) ? 'Please enter a valid email address' : null),
            phoneNumber: this.phoneNumber ? this.validatePhoneForSubmit() : null
        };
        return !Object.values(this.errors).some(error => error !== null);
    }

    private validatePhoneForSubmit(): string | null {
        const digitsOnly = this.phoneNumber.replace(/\s/g, '');
        const validPrefixes = ['10', '11', '12', '15'];
        const hasValidPrefix = validPrefixes.some(prefix => digitsOnly.startsWith(prefix));
        return (!/^\d+$/.test(digitsOnly) || digitsOnly.length !== 10 || !hasValidPrefix)
            ? 'Please enter a valid Egyptian phone number' : null;
    }

    // ==================== Password Update ====================

    updatePassword(): void {
        this.passwordError.set(null);
        this.passwordAttempted.set(false);
        this.checkPasswordRequirements();

        if (!this.currentPassword) {
            this.passwordError.set('Current password is required');
            return;
        }
        if (!this.newPassword) {
            this.passwordError.set('New password is required');
            return;
        }

        // Check password requirements
        if (!this.passwordRequirements.minLength || !this.passwordRequirements.hasUppercase || !this.passwordRequirements.hasDigit) {
            this.passwordAttempted.set(true); // Only show requirements when they fail
            this.passwordError.set('Password does not meet all requirements');
            return;
        }

        if (this.newPassword !== this.confirmPassword) {
            this.passwordError.set('Passwords do not match');
            return;
        }

        this.updatingPassword.set(true);
        this.userService.updatePassword({
            oldPassword: this.currentPassword,
            newPassword: this.newPassword
        }).subscribe({
            next: (res) => {
                this.updatingPassword.set(false);
                this.passwordAttempted.set(false);
                this.authService.setAuthState(res);
                this.currentPassword = '';
                this.newPassword = '';
                this.confirmPassword = '';
                this.toastr.success('Password updated successfully!');
            },
            error: () => {
                this.updatingPassword.set(false);
            }
        });
    }


    // ==================== Validation Methods ====================

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
            ? 'Please enter a valid Egyptian phone number' : null;
    }

    private validateNameField(value: string, fieldName: string): string | null {
        if (!value) return null;
        if (!value.trim()) return `${fieldName} is required`;
        if (/[\d\s]/.test(value)) return `${fieldName} cannot contain numbers or spaces`;
        return null;
    }
}
