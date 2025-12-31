//Angular Imports
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
//Services
import { CartService } from '../../../core/services';
//Models
import { CartItemDto } from '../../../core/models';

declare const AOS: any;

@Component({
  selector: 'app-cart',
  imports: [RouterLink, DecimalPipe, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements AfterViewInit {
  //Angular
  router = inject(Router);
  //Services
  cartService = inject(CartService);

  //State
  cartItems = signal<CartItemDto[]>([]);
  cartTotal = signal(0);
  isLoading = signal(false);
  shippingMethod = 'standard';
  shakingProductId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadFromLocalState();
    this.refreshFromApi();
  }

  ngAfterViewInit(): void {
    if (typeof AOS !== 'undefined') {
      setTimeout(() => AOS.refresh(), 100);
    }
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
          this.cartTotal.set(cart.total ?? this.calculateTotal(cart.items));
        }
      },
      error: (err) => console.error('Failed to refresh cart:', err.message)
    });
  }

  private calculateTotal(items: CartItemDto[]): number {
    return items.reduce((sum, item) => sum + (item.total ?? item.productPrice * item.quantity), 0);
  }

  addCartItem(productId: number): void {
    const currentItem = this.cartItems().find(item => item.productId === productId);
    const expectedQuantity = currentItem ? currentItem.quantity + 1 : 1;

    this.cartService.addToCart(productId, 1).subscribe({
      next: (cart) => {
        const updatedItem = cart.items.find(item => item.productId === productId);
        if (updatedItem && updatedItem.quantity < expectedQuantity) {
          this.triggerShake(productId);
        }
        this.cartItems.set(cart.items);
        this.cartTotal.set(cart.total ?? this.calculateTotal(cart.items));
      },
      error: (err) => {
        console.error('Failed to add item:', err.message);
      }
    });
  }

  private triggerShake(productId: number): void {
    this.shakingProductId.set(productId);
    setTimeout(() => this.shakingProductId.set(null), 400);
  }

  removeCartItem(productId: number): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: (cart) => {
        this.cartItems.set(cart.items);
        this.cartTotal.set(cart.total ?? this.calculateTotal(cart.items));
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
        this.cartTotal.set(cart.total ?? this.calculateTotal(cart.items));
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
        this.cartTotal.set(cart?.total ?? 0);
      },
      error: (err) => {
        console.error('Failed to clear cart:', err.message);
      }
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout'], {
      queryParams: { shippingMethod: this.shippingMethod },
      state: { fromCart: true }
    });
  }
}
