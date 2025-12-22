import { DecimalPipe, NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, CartService, CategoryService } from '../../../core/services';
import { Product } from '../../../core/models/product.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  imports: [DecimalPipe, NgClass, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  productData = input.required<Product>();
  viewType = input.required<string>();

  categoryService = inject(CategoryService);
  cartService = inject(CartService);
  authService = inject(AuthService);
  router = inject(Router);
  toastr = inject(ToastrService);

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
}
