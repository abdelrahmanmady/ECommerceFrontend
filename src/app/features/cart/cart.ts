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

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems(){
    this.cartService.getUserCart().subscribe({
      next:(res)=>{
        console.log(res);
        this.cartItems.set(res.items);
      },
      error:(err)=>{
        console.log(err.message);
      }
    })

  }

  addCartItem(id:string){
    this.cartService.AddCartItem(id).subscribe({
      next:(res)=>{
        console.log(res);
        this.loadCartItems();
      },
      error:(err)=>{
        console.log(err.message);
      }
    })
  }

  removeCartItem(id:string){
    this.cartService.DeleteCartItem(id).subscribe({
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
    this.cartService.clearCart().subscribe({
      next:(res)=>{
        console.log(res);
        this.loadCartItems();
      },
      error:(err)=>{
        console.log(err.message);
      }
    })
  }

}
