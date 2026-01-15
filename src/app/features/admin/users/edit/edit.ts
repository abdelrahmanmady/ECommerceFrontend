// Angular Imports
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Libraries
import { ToastrService } from 'ngx-toastr';
import { UAParser } from 'ua-parser-js';
// Services
import { UserService } from '../../../../core/services/user.service';
// Models
import { AdminUserDetailsResponse } from '../../../../core/models/user.model';
import { AddressSummaryDto } from '../../../../core/models/address.model';
// Environment
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './edit.html',
  styleUrls: ['../style.css'],
})
export class UserEditComponent implements OnInit {
  // ==================== Injected Services ====================
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  // ==================== State ====================
  user = signal<AdminUserDetailsResponse | null>(null);
  selectedRole = signal<string>('');

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getAdminUserDetails(userId).subscribe({
        next: (response) => {
          this.user.set(response);
          this.selectedRole.set(response.role?.toLowerCase() || '');
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
        },
      });
    }
  }

  // ==================== Helper Methods ====================
  getAvatarUrl(): string | null {
    const user = this.user();
    return user?.avatarUrl ? environment.url + user.avatarUrl : null;
  }

  getInitials(): string {
    const user = this.user();
    if (!user?.fullName) return '';
    const parts = user.fullName.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  getRoleBadgeClass(): string {
    const role = this.user()?.role?.toLowerCase();
    switch (role) {
      case 'superadmin':
        return 'badge-role-superadmin';
      case 'admin':
        return 'badge-role-admin';
      case 'seller':
        return 'badge-role-seller';
      case 'customer':
      default:
        return 'badge-role-customer';
    }
  }

  getStatusBadgeClass(): string {
    const status = this.user()?.accountStatus;
    switch (status) {
      case 'Active':
        return 'badge-status-active';
      case 'Locked':
        return 'badge-status-locked';
      case 'Deleted':
        return 'badge-status-deleted';
      default:
        return 'badge-status-active';
    }
  }

  getStatusIcon(): string {
    const status = this.user()?.accountStatus;
    switch (status) {
      case 'Active':
        return 'fa-check-circle';
      case 'Locked':
        return 'fa-lock';
      case 'Deleted':
        return 'fa-trash';
      default:
        return 'fa-check-circle';
    }
  }

  getSortedAddresses(): AddressSummaryDto[] {
    const addresses = this.user()?.savedAddresses || [];
    return [...addresses].sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });
  }

  getTimeAgo(date: string | Date): string {
    const now = new Date();
    let past: Date;

    // Handle UTC dates without timezone info
    if (typeof date === 'string' && !date.includes('Z') && !date.includes('+')) {
      past = new Date(date + 'Z');
    } else {
      past = new Date(date);
    }

    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes <= 0 ? 'Just now' : `${diffMinutes} mins ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    }
  }

  getOrderStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'badge-pending';
      case 'processing':
        return 'badge-processing';
      case 'shipped':
        return 'badge-shipped';
      case 'delivered':
        return 'badge-delivered';
      case 'cancelled':
        return 'badge-cancelled';
      default:
        return 'badge-pending';
    }
  }

  getPaymentMethodLabel(method: string): string {
    switch (method?.toLowerCase()) {
      case 'cashondelivery':
        return 'Cash On Delivery';
      case 'paymob':
        return 'Paymob';
      case 'stripe':
        return 'Stripe';
      default:
        return method || 'Unknown';
    }
  }

  // ==================== Session Helper Methods ====================
  getDeviceIcon(userAgent: string | undefined): string {
    if (!userAgent) return 'fa-desktop';

    const result = UAParser(userAgent);
    const deviceType = result.device.type;

    switch (deviceType) {
      case 'mobile':
        return 'fa-mobile-alt';
      case 'tablet':
        return 'fa-tablet-alt';
      default:
        return 'fa-desktop';
    }
  }

  getDeviceInfo(userAgent: string | undefined): string {
    if (!userAgent) return 'Unknown Device';

    const result = UAParser(userAgent);
    const browserName = result.browser.name || 'Unknown Browser';
    const osName = result.os.name || 'Unknown OS';

    return `${browserName} / ${osName}`;
  }

  formatSessionDate(date: string): string {
    return this.getTimeAgo(date);
  }

  // ==================== Action Methods ====================
  deleteUser(): void {
    const userId = this.user()?.id;
    if (userId) {
      this.userService.deleteAdminUser(userId).subscribe({
        next: () => {
          // Refresh user data to update the UI
          this.userService.getAdminUserDetails(userId).subscribe({
            next: (response) => this.user.set(response),
          });
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
    }
  }

  restoreUser(): void {
    const userId = this.user()?.id;
    if (userId) {
      this.userService.restoreAdminUser(userId).subscribe({
        next: () => {
          // Refresh user data to update the UI
          this.userService.getAdminUserDetails(userId).subscribe({
            next: (response) => this.user.set(response),
          });
        },
        error: (error) => {
          console.error('Error restoring user:', error);
        },
      });
    }
  }

  // ==================== Role Update Methods ====================
  updateRole(): void {
    const userId = this.user()?.id;
    const newRole = this.selectedRole();

    if (!userId || !newRole) return;

    // Capitalize first letter for API
    const formattedRole = newRole.charAt(0).toUpperCase() + newRole.slice(1);

    this.userService.updateAdminUserRole(userId, formattedRole).subscribe({
      next: () => {
        this.toastr.success('User role updated successfully!', 'Success');
        // Refresh user data to update the UI
        this.userService.getAdminUserDetails(userId).subscribe({
          next: (response) => {
            this.user.set(response);
            this.selectedRole.set(response.role?.toLowerCase() || '');
          },
        });
      },
      error: (error) => {
        console.error('Error updating user role:', error);
        this.toastr.error('Failed to update user role', 'Error');
      },
    });
  }

  resetRole(): void {
    const currentRole = this.user()?.role?.toLowerCase() || '';
    this.selectedRole.set(currentRole);
  }

  unlockUser(): void {
    const userId = this.user()?.id;
    if (userId) {
      this.userService.unlockAdminUser(userId).subscribe({
        next: () => {
          this.toastr.success('User account unlocked successfully!', 'Success');
          // Refresh user data to update the UI
          this.userService.getAdminUserDetails(userId).subscribe({
            next: (response) => this.user.set(response),
          });
        },
        error: (error) => {
          console.error('Error unlocking user:', error);
          this.toastr.error('Failed to unlock user account', 'Error');
        },
      });
    }
  }
}
