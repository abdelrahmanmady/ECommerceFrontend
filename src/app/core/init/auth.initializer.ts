//Angular Imports
import { inject } from "@angular/core";
//Libraries
import { firstValueFrom } from "rxjs";
//Services
import { AuthService, CartService, WishlistService } from "../services";

export async function authInitializer() {
  //Services
  const authService = inject(AuthService);
  const cartService = inject(CartService);
  const wishlistService = inject(WishlistService);

  try {
    const res = await firstValueFrom(authService.refreshToken());
    if (res) {
      authService.setAuthState(res);
      cartService.getUserCart().subscribe();
      wishlistService.getWishlistIds().subscribe();
    }
  } catch {
    authService.clearAuthState();
  }
}
