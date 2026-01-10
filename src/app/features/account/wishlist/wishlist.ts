//Angular Imports
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
//Libraries
import { forkJoin, timer, first } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
//Services
import { WishlistService, CartService } from '../../../core/services';
//Models
import { WishlistItemSummaryDto } from '../../../core/models/wishlist.model';

@Component({
  selector: 'app-account-wishlist',
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class AccountWishlist {
  //Services
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);
  toastr = inject(ToastrService);

  //State
  wishlistItems = signal<WishlistItemSummaryDto[]>([]);
  isLoading = signal(true);

  // ==================== Constructor ====================

  constructor() {
    this.loadWishlist();
  }

  // ==================== Data Loading ====================

  loadWishlist(): void {
    this.isLoading.set(true);

    const apiCall = this.wishlistService.getWishlistItems();
    const minDelay = timer(300);

    forkJoin([apiCall, minDelay]).subscribe({
      next: ([items]) => {
        this.wishlistItems.set(items);
        this.isLoading.set(false);
      },
      error: () => {
        this.wishlistItems.set([]);
        this.isLoading.set(false);
      },
    });
  }

  // ==================== Helpers ====================

  get hasItems(): boolean {
    return this.wishlistItems().length > 0;
  }

  // ==================== Actions ====================

  removeItem(productId: number): void {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.wishlistItems.update((items) => items.filter((item) => item.productId !== productId));
        this.toastr.success('Removed from wishlist');
      },
      error: () => {
        // Error toast handled by global error interceptor
      },
    });
  }

  addToCart(productId: number) {
    this.cartService
      .addToCart(productId, 1)
      .pipe(first())
      .subscribe({
        next: () => this.toastr.success('Product added to cart'),
        error: () => {
          // Error toast handled by global error interceptor
        },
      });
  }

  addAllToCart() {
    const validItems = this.wishlistItems().filter((item) => !item.isDeleted && item.inStock);

    if (validItems.length === 0) {
      this.toastr.info('No available items to add to cart');
      return;
    }

    const currentCart = this.cartService.cartItems();
    const cartMap = new Map<number, number>();

    // 1. Add existing cart items to map
    currentCart.forEach((item) => {
      cartMap.set(item.productId, item.quantity);
    });

    // 2. Merge wishlist items
    let addedCount = 0;
    validItems.forEach((item) => {
      const currentQty = cartMap.get(item.productId) || 0;
      cartMap.set(item.productId, currentQty + 1);
      addedCount++;
    });

    // 3. Convert map back to array for API
    const itemsToUpdate: { productId: number; quantity: number }[] = [];
    cartMap.forEach((quantity, productId) => {
      itemsToUpdate.push({ productId, quantity });
    });

    // 4. Call API
    this.cartService
      .updateCart(itemsToUpdate)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastr.success(`${addedCount} items added to cart`);
        },
        error: () => {
          // Error toast handled by global error interceptor
        },
      });
  }
}
