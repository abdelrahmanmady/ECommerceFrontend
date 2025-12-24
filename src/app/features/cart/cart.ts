import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, DecimalPipe, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartService = inject(CartService);
  router = inject(Router);

  cartItems = signal<CartItem[]>([]);
  cartTotal = signal(0);
  isLoading = signal(false);
  shippingMethod = 'standard';

  ngOnInit(): void {
    this.loadFromLocalState();
    this.refreshFromApi();
  }

  private loadFromLocalState(): void {
    const localItems = this.cartService.cartItems();
    this.cartItems.set(localItems);
    this.cartTotal.set(this.calculateTotal(localItems));
  }

  private refreshFromApi(): void {
    this.cartService.getUserCart().subscribe({
      next: (cart) => {
        if (cart && cart.items) {
          this.cartItems.set(cart.items);
          this.cartTotal.set(cart.cartTotal ?? this.calculateTotal(cart.items));
        }
      },
      error: (err) => console.error('Failed to refresh cart:', err.message)
    });
  }

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

  proceedToCheckout(): void {
    this.router.navigate(['/checkout'], {
      queryParams: { shippingMethod: this.shippingMethod }
    });
  }
}
