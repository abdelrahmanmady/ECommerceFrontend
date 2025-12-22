import { inject } from "@angular/core";
import { AuthService, CartService } from "../services";
import { firstValueFrom } from "rxjs";

export async function authInitializer() {
  const authService = inject(AuthService);
  const cartService = inject(CartService);

  try {
    const res = await firstValueFrom(authService.refreshToken());
    if (res) {
      authService.setAuthState(res);
      // Fetch cart after auth is restored to update cart badge
      cartService.getUserCart().subscribe();
    }
  } catch {
    // No valid refresh token - user will need to log in
    authService.clearAuthState();
  }
}
