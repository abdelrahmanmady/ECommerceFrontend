import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
    selector: 'app-account-layout',
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
    templateUrl: './account-layout.html',
    styleUrl: './account-layout.css',
})
export class AccountLayout {
    authService = inject(AuthService);

    logout() {
        this.authService.logout();
    }
}
