//Angular Imports
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
//Services
import { AuthService } from '../../../core/services';

@Component({
    selector: 'app-account-layout',
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
    templateUrl: './account-layout.html',
    styleUrl: './account-layout.css',
})
export class AccountLayout {
    //Services
    authService = inject(AuthService);

    // ==================== User Display Helpers ====================

    getInitials(): string {
        const fullName = this.authService.user()?.fullName || 'Guest';
        const names = fullName.trim().split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return fullName.substring(0, 2).toUpperCase();
    }

    getRoleIcon(): string {
        const role = this.authService.user()?.roles?.[0];
        switch (role) {
            case 'Admin': return 'bi-shield-lock';
            case 'Seller': return 'bi-shop';
            case 'Customer': return 'bi-person';
            default: return 'bi-award';
        }
    }

    // ==================== Auth Actions ====================

    logout(): void {
        this.authService.logout();
    }
}
