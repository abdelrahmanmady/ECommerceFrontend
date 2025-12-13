import { inject } from "@angular/core";
import { AuthService } from "../services";
import { firstValueFrom } from "rxjs";

export async function authInitializer() {
  const authService = inject(AuthService);

    try {
      const res = await firstValueFrom(authService.refreshToken());      
      
      if (res) {
        localStorage.setItem('accessToken', res.accessToken);
        authService.user.set(res.user);
      }
      
      console.log('Auth initialized', res);
    } catch (err) {
      console.error('Error refreshing token', err);
      authService.user.set(null);
    }
}
