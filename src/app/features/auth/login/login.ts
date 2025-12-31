//Angular Imports
import { ChangeDetectorRef, Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from "@angular/router";
//Libraries
import { ToastrService } from 'ngx-toastr';
//Services
import { AuthService, CartService, WishlistService } from '../../../core/services';
//Types
import { RoleType } from '../../../core/types/role.type';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgClass, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  //State
  showPassword = false;
  rememberMe = false;
  identifier = '';
  password = '';
  errors = { identifier: '', password: '' };
  hasApiError = false;

  constructor(
    //Angular
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    //Libraries
    private readonly toastr: ToastrService,
    //Services
    private readonly authService: AuthService,
    private readonly cartService: CartService,
    private readonly wishlistService: WishlistService
  ) { }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  clearErrors(): void {
    this.errors = { identifier: '', password: '' };
    this.hasApiError = false;
  }

  validateIdentifier(): void {
    if (this.hasApiError) {
      this.hasApiError = false;
      this.errors.password = '';
    }
    this.errors.identifier = !this.identifier?.trim() ? 'Email or Username is required' : '';
  }

  validatePassword(): void {
    if (this.hasApiError) {
      this.hasApiError = false;
    }
    this.errors.password = !this.password ? 'Password is required' : '';
  }

  login(): void {
    this.clearErrors();
    let hasError = false;

    if (!this.identifier) {
      this.errors.identifier = 'Email or Username is required';
      hasError = true;
    }

    if (!this.password) {
      this.errors.password = 'Password is required';
      hasError = true;
    }

    if (hasError) return;

    this.authService.login({ identifier: this.identifier, password: this.password, rememberMe: this.rememberMe }).subscribe({
      next: (res) => {
        this.authService.setAuthState(res);
        this.cartService.getUserCart().subscribe();
        this.wishlistService.getWishlistIds().subscribe();
        this.toastr.success('Login successful!');
        const isAdminOrSeller = res.roles.includes(RoleType.Admin) || res.roles.includes(RoleType.Seller);
        this.router.navigate([isAdminOrSeller ? '/admin' : '/home']);
      },
      error: (err) => {
        const errorDetail = err.error?.detail || 'An error occurred. Please try again.';
        this.hasApiError = true;
        this.errors.password = errorDetail;
        this.cdr.detectChanges();
      }
    });
  }
}
