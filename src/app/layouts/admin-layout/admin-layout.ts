import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  //Services
  authService = inject(AuthService);

  //State
  sidebarCollapsed = false;
  mobileSidebarOpen = false;

  //Methods
  toggleSidebarCollapse(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
  }

  getInitials(): string {
    const fullName = this.authService.user()?.fullName || 'Admin';
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  }

  getAvatarUrl(): string | null {
    const avatarPath = this.authService.user()?.avatarUrl;
    if (!avatarPath) return null;
    return `${environment.url}${avatarPath}`;
  }

  logout(): void {
    this.authService.logout();
  }
}
