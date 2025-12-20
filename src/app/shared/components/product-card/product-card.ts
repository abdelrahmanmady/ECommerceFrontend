import { DecimalPipe, NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService, CategoryService } from '../../../core/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  imports: [DecimalPipe, NgClass, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  productData = input.required<any>();
  viewType = input.required<string>();

  categoryService = inject(CategoryService);
  cartService = inject(CartService);
  router = inject(Router);
  toastr = inject(ToastrService);

  addToCart() {
    this.cartService.AddCartItem(this.productData().id).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success('Product added to cart');
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error);
      }
    });
  }
}
