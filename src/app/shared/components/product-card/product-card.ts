import { DecimalPipe, NgClass } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, CartService, WishlistService } from '../../../core/services';
import { ProductSummaryDto } from '../../../core/models/product.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  imports: [DecimalPipe, NgClass, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  productData = input.required<ProductSummaryDto>();
  viewType = input.required<string>();

  cartService = inject(CartService);
  authService = inject(AuthService);
  wishlistService = inject(WishlistService);
  toastr = inject(ToastrService);

  isWishlisted = computed(() => this.wishlistService.wishlistIds().includes(this.productData().id));

  // Generates array of 5 star types: 'full', 'half', or 'empty'
  getStarsArray(rating: number): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];
    const clampedRating = Math.max(0, Math.min(5, rating));
    const fullStars = Math.floor(clampedRating);
    const hasHalf = clampedRating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('full');
      } else if (i === fullStars && hasHalf) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }

  addToCart() {
    if (!this.authService.user()) {
      this.toastr.info('Please login first');
      return;
    }

    this.cartService.addToCart(this.productData().id, 1).subscribe({
      next: () => {
        this.toastr.success('Product added to cart');
      },
      error: () => {
        // Error toast handled by global error interceptor
      },
    });
  }

  toggleWishlist() {
    if (!this.authService.user()) {
      this.toastr.info('Please login first');
      return;
    }

    if (this.isWishlisted()) {
      this.wishlistService.removeFromWishlist(this.productData().id).subscribe({
        next: () => {
          this.toastr.success('Removed from wishlist');
        },
        error: () => {
          // Error toast handled by global error interceptor
        },
      });
      return;
    }

    this.wishlistService.addToWishlist(this.productData().id).subscribe({
      next: () => {
        this.toastr.success('Added to wishlist');
      },
      error: () => {
        // Error toast handled by global error interceptor
      },
    });
  }
}
