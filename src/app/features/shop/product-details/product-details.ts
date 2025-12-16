import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  imports: [],
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
  
  productId = this.activeRoute.snapshot.paramMap.get('id');
  quantity: number = 1;

  constructor() {
    this.productService.getProductById(this.productId!).subscribe((res) => {
      res.images.sort((a: any, b: any) => a.position - b.position);
      this.productData.set(res);
      this.mainImage.set(res.images[0]);
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

  increaseQty(): void {
    this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  addToCart(){
    this.cartService.AddCartItem(this.productData().id).subscribe({
      next:(res)=>{
        console.log(res);
        this.cartService.setCartCount(res.cartItems.length);
        this.toastr.success('Product added to cart');
        // this.router.navigate(['/cart']);
      },
      error:(err)=>{
        console.log(err);
        this.toastr.error(err.error);
      }
    })
  }
}
