import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart-service';
import { CartItemsService } from '../../core/services/cart-items-service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartService = inject(CartService);
  cartItemService = inject(CartItemsService);
  cartItems = signal<any>({});
  quantity: number = 1;

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems(){
this.cartService.getCartByUserId('10').subscribe((res) => {
      this.cartItems.set(res.cartItems);
      this.cartService.setCartCount(res.cartItems.length);
      console.log(res);
    });
  }

  increaseQty(item: any): void {
    if (item.quantity <= item.product.stock) {
      item.quantity++;
    }
    console.log(item.quantity);
  }

  decreaseQty(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  updateCartItem() {
    const items = this.cartItems();
    items.forEach((item: any) => {
      this.cartItemService.UpdateCartItems(item.id, { quantity: item.quantity }).subscribe({
        error: (err) => {
          console.log(err.message);
        },
      });
    });
  }

  removeCartItem(id:string){
    this.cartItemService.DeleteCartItems(id).subscribe({
      next:(res)=>{
        console.log(res);
        this.loadCartItems();
      },
      error:(err)=>{
        console.log(err.message);
      }
    })

  }
  clearCart(){
    const items = this.cartItems();
    items.forEach((item: any) => {
      this.cartItemService.DeleteCartItems(item.id).subscribe({
        next:(res)=>{
          console.log(res);
          this.loadCartItems();
        },
        error:(err)=>{
          console.log(err.message);
        }
      })
    })
  }

}
