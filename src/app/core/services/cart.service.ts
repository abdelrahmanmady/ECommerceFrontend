import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cart, CartItem } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly baseUrl: string = `${environment.url}/api/Cart`;
  private http = inject(HttpClient);

  cartItems = signal<CartItem[]>([]);
  private cartCount = signal(0);
  private broadcastChannel = new BroadcastChannel('cart_sync');

  constructor() {
    this.broadcastChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'UPDATE') {
        this.updateLocalState(event.data.items);
      }
    };
  }

  setCartCount(count: number): void {
    this.cartCount.set(count);
  }

  getCartCount(): number {
    return this.cartCount();
  }

  /** Clear local cart state (used on logout) */
  clearLocalCart(): void {
    this.cartItems.set([]);
    this.setCartCount(0);
  }

  private updateLocalState(items: CartItem[]): void {
    this.cartItems.set(items);
    // Count unique items instead of total quantity
    this.setCartCount(items.length);
  }

  /** Get user's cart from API */
  getUserCart(): Observable<Cart> {
    return this.http.get<Cart>(this.baseUrl).pipe(
      tap((cart) => {
        if (cart && cart.items) {
          this.updateLocalState(cart.items);
        }
      })
    );
  }

  /** Update cart with new items */
  updateCart(items: Pick<CartItem, 'productId' | 'quantity'>[]): Observable<Cart> {
    return this.http.post<Cart>(this.baseUrl, { items }).pipe(
      tap((res) => {
        if (res && res.items) {
          this.updateLocalState(res.items);
          this.broadcastChannel.postMessage({ type: 'UPDATE', items: res.items });
        }
      })
    );
  }

  /** Clear all items from cart */
  clearCart(): Observable<Cart> {
    return this.http.delete<Cart>(this.baseUrl).pipe(
      tap(() => {
        this.updateLocalState([]);
        this.broadcastChannel.postMessage({ type: 'UPDATE', items: [] });
      })
    );
  }

  /** Add item to cart or increase quantity */
  addToCart(productId: number, quantity: number = 1): Observable<Cart> {
    const currentItems = [...this.cartItems()];
    const existingItem = currentItems.find((i) => i.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Create minimal item for API request
      currentItems.push({ productId, quantity } as CartItem);
    }

    return this.updateCart(currentItems.map(i => ({ productId: i.productId, quantity: i.quantity })));
  }

  /** Decrease item quantity by 1 */
  decreaseFromCart(productId: number): Observable<Cart> {
    const currentItems = [...this.cartItems()];
    const existingItem = currentItems.find((i) => i.productId === productId);

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        return this.updateCart(currentItems.map(i => ({ productId: i.productId, quantity: i.quantity })));
      } else {
        return this.removeFromCart(productId);
      }
    }

    return this.updateCart(currentItems.map(i => ({ productId: i.productId, quantity: i.quantity })));
  }

  /** Remove item from cart entirely */
  removeFromCart(productId: number): Observable<Cart> {
    const currentItems = this.cartItems().filter((i) => i.productId !== productId);
    return this.updateCart(currentItems.map(i => ({ productId: i.productId, quantity: i.quantity })));
  }
}
