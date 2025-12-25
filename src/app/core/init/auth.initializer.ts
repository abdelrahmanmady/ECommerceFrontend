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
      cartService.getUserCart().subscribe();
    }
  } catch {
    authService.clearAuthState();
  }
}
