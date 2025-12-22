import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartService = inject(CartService);

  // Cart state - initialized from local service state
  cartItems = signal<CartItem[]>([]);
  cartTotal = signal(0);
  isLoading = signal(false);

  ngOnInit(): void {
    // 1. Show local cart immediately for instant UX
    this.loadFromLocalState();

    // 2. Refresh from API in background to ensure data freshness
    this.refreshFromApi();
  }

  /**
   * Load cart from local CartService state (instant, no API call)
   */
  private loadFromLocalState(): void {
    const localItems = this.cartService.cartItems();
    this.cartItems.set(localItems);
    this.cartTotal.set(this.calculateTotal(localItems));
  }

  /**
   * Refresh cart from API in background
   */
  private refreshFromApi(): void {
    this.cartService.getUserCart().subscribe({
      next: (cart) => {
        if (cart && cart.items) {
          this.cartItems.set(cart.items);
          this.cartTotal.set(cart.cartTotal ?? this.calculateTotal(cart.items));
        }
      },
      error: (err) => {
        // Silently fail - local data is already displayed
        console.error('Failed to refresh cart from API:', err.message);
      }
    });
  }

  /**
   * Calculate cart total from items
   */
  private calculateTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + (item.total ?? item.productPrice * item.quantity), 0);
  }

  addCartItem(productId: number): void {
    this.cartService.addToCart(productId, 1).subscribe({
      next: (cart) => {
        this.cartItems.set(cart.items);
        this.cartTotal.set(cart.cartTotal ?? this.calculateTotal(cart.items));
      },
      error: (err) => {
        console.error('Failed to add item:', err.message);
      }
    });
  }

  removeCartItem(productId: number): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: (cart) => {
        this.cartItems.set(cart.items);
        this.cartTotal.set(cart.cartTotal ?? this.calculateTotal(cart.items));
      },
      error: (err) => {
        console.error('Failed to remove item:', err.message);
      }
    });
  }

  decreaseQuantity(productId: number): void {
    this.cartService.decreaseFromCart(productId).subscribe({
      next: (cart) => {
        this.cartItems.set(cart.items);
        this.cartTotal.set(cart.cartTotal ?? this.calculateTotal(cart.items));
      },
      error: (err) => {
        console.error('Failed to decrease quantity:', err.message);
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: (cart) => {
        this.cartItems.set(cart?.items ?? []);
        this.cartTotal.set(cart?.cartTotal ?? 0);
      },
      error: (err) => {
        console.error('Failed to clear cart:', err.message);
      }
    });
  }
}
