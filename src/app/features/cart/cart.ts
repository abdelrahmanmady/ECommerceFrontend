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

  // Dummy data for design mode - replace with API call when ready
  cartItems = signal<any[]>([
    {
      id: 1,
      productId: 101,
      productName: 'Classic Cotton T-Shirt',
      productImageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
      price: 450,
      quantity: 2,
      total: 900,
      size: 'M'
    },
    {
      id: 2,
      productId: 102,
      productName: 'Slim Fit Denim Jeans',
      productImageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      price: 890,
      quantity: 1,
      total: 890,
      size: '32'
    },
    {
      id: 3,
      productId: 103,
      productName: 'Leather Crossbody Bag',
      productImageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop',
      price: 1250,
      quantity: 1,
      total: 1250,
      size: 'One Size'
    }
  ]);
  cartTotal = signal(3040);

  ngOnInit() {
    // Uncomment to use real API data:
    // this.loadCartItems();
  }

  loadCartItems() {
    this.cartService.getUserCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartItems.set(res.items);
        this.cartTotal.set(res.cartTotal);
        this.cartService.setCartCount(res.items.length);
      },
      error: (err) => {
        console.log(err.message);
      }
    })

  }

  addCartItem(productId: number) {
    this.cartService.addToCart(productId, 1).subscribe({
      next: (res) => {
        this.cartItems.set(res.items);
        this.cartTotal.set(res.cartTotal);
      },
      error: (err) => {
        console.log(err.message);
      }
    })
  }

  removeCartItem(productId: number) {
    this.cartService.removeFromCart(productId).subscribe({
      next: (res) => {
        this.cartItems.set(res.items);
        this.cartTotal.set(res.cartTotal);
      },
      error: (err) => {
        console.log(err.message);
      }
    })
  }
  clearCart() {
    this.cartService.clearCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartItems.set(res.items);
        this.cartTotal.set(res.cartTotal);
        this.cartService.setCartCount(res.items.length);
      },
      error: (err) => {
        console.log(err.message);
      }
    })
  }

}
