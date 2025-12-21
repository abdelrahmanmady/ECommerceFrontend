import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services';
import { ToastrService } from 'ngx-toastr';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink, CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  activeRoute = inject(ActivatedRoute);
  productService = inject(ProductService);
  cartService = inject(CartService);
  toastr = inject(ToastrService);
  router = inject(Router);

  productData = signal<any>({});
  mainImage = signal<any>({});
  activeImage = signal(0);

  sizes = signal([
    { name: 'XS', available: false },
    { name: 'S', available: true },
    { name: 'M', available: true },
    { name: 'L', available: true },
    { name: 'XL', available: false },
  ]);
  selectedSize = signal<string | null>(null);

  productId: number;
  quantity: number = 1;
  maxStock: number = 13; // Dummy stock count
  isShaking = signal(false);

  constructor() {
    const idParam = this.activeRoute.snapshot.paramMap.get('id');
    this.productId = idParam ? parseInt(idParam, 10) : 0;

    // TODO: This will be updated when product details API is integrated
    this.productService.getProductById(this.productId).subscribe((res: any) => {
      res.images?.sort((a: any, b: any) => a.position - b.position);
      this.productData.set(res);
      this.mainImage.set(res.images?.[0] || {});
      this.activeImage.set(0);
    });
  }
  selectImage(index: number) {
    this.mainImage.set(this.productData().images[index]);
    this.activeImage.set(index);
  }
  prevImage() {
    const index =
      this.activeImage() > 0 ? this.activeImage() - 1 : this.productData().images.length - 1;
    this.selectImage(index);
  }

  nextImage() {
    const index =
      this.activeImage() < this.productData().images.length - 1 ? this.activeImage() + 1 : 0;
    this.selectImage(index);
  }

  selectSize(size: string) {
    this.selectedSize.set(size);
  }

  increaseQty(): void {
    if (this.quantity < this.maxStock) {
      this.quantity++;
    } else {
      this.triggerShake();
    }
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    } else {
      this.triggerShake();
    }
  }

  triggerShake() {
    this.isShaking.set(true);
    setTimeout(() => this.isShaking.set(false), 400);
  }
  addToCart() {
    this.cartService.AddCartItem(this.productData().id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartService.setCartCount(res.cartItems.length);
        this.toastr.success('Product added to cart');
        // this.router.navigate(['/cart']);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error);
      }
    })
  }
}
