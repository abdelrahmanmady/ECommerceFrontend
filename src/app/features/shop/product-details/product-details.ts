import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';
import { CartItemsService } from '../../../core/services/cart-items-service';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  activeRoute = inject(ActivatedRoute);
  productService = inject(ProductService);
  cartItemService = inject(CartItemsService);
  productData = signal<any>({});
  productId = this.activeRoute.snapshot.paramMap.get('id');
  mainImage = signal<any>({});
  activeImage = signal(0);
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
    this.cartItemService.AddCartItems({
      cartId:"1",
      productId: this.productId,
      quantity: this.quantity,
    }).subscribe({
      error:(err)=>{
        console.log(err);
      }
    });
console.log ("added to cart");
  }
}
