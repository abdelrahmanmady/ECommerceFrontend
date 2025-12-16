import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartService = inject(CartService);
  cartItems = signal<any>({});
  cartTotal = signal(0);

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems(){
    this.cartService.getUserCart().subscribe({
      next:(res)=>{
        console.log(res);
        this.cartItems.set(res.items);
        this.cartTotal.set(res.cartTotal);
        this.cartService.setCartCount(res.items.length);
      },
      error:(err)=>{
        console.log(err.message);
      }
    })

  }

  addCartItem(productId:string){
    this.cartService.AddCartItem(productId).subscribe({
      next:(res)=>{
        console.log(res);
        this.cartItems.set(res.items);
        this.cartTotal.set(res.cartTotal);
        this.cartService.setCartCount(res.items.length);
      },
      error:(err)=>{
        console.log(err.message);
      }
    })
  }

  removeCartItem(productId:string){
    this.cartService.DeleteCartItem(productId).subscribe({
      next:(res)=>{
        console.log(res);
        this.cartItems.set(res.items);
        this.cartTotal.set(res.cartTotal);
        this.cartService.setCartCount(res.items.length);
      },
      error:(err)=>{
        console.log(err.message);
      }
    })

  }
  clearCart(){
    this.cartService.clearCart().subscribe({
      next:(res)=>{
        console.log(res);
        this.cartItems.set(res.items);
        this.cartTotal.set(res.cartTotal);
        this.cartService.setCartCount(res.items.length);
      },
      error:(err)=>{
        console.log(err.message);
      }
    })
  }

}
