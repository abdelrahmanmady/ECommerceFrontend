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

  isWishlisted = computed(() =>
    this.wishlistService.wishlistIds().includes(this.productData().id)
  );

  addToCart() {
    if (!this.authService.user()) {
      this.toastr.info('Please login first');
      return;
    }

    this.cartService.addToCart(this.productData().id, 1).subscribe({
      next: () => {
        this.toastr.success('Product added to cart');
      },
      error: (err) => {
        this.toastr.error(err.error);
      }
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
        error: (err) => {
          this.toastr.error(err.error || 'Failed to remove from wishlist');
        }
      });
      return;
    }

    this.wishlistService.addToWishlist(this.productData().id).subscribe({
      next: () => {
        this.toastr.success('Added to wishlist');
      },
      error: (err) => {
        this.toastr.error(err.error || 'Failed to add to wishlist');
      }
    });
  }
}
