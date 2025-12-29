//Angular Imports
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//Libraries
import { Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
//Environment
import { environment } from '../../../environments/environment';
//Models
import { CartResponse, CartItemDto, UpdateCartItemDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly baseUrl: string = `${environment.url}/api/Cart`;
  //Angular
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);

  //State
  cartItems = signal<CartItemDto[]>([]);
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

  clearLocalCart(): void {
    this.cartItems.set([]);
    this.setCartCount(0);
  }

  private updateLocalState(items: CartItemDto[]): void {
    this.cartItems.set(items);
    this.setCartCount(items.length);
  }

  // Display warnings from cart response as toasts
  private showWarnings(response: CartResponse): void {
    if (response.warnings && response.warnings.length > 0) {
      response.warnings.forEach(warning => {
        this.toastr.warning(warning, 'Cart Notice');
      });
    }
  }

  getUserCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.baseUrl).pipe(
      tap((cart) => {
        if (cart && cart.items) {
          this.updateLocalState(cart.items);
        }
        this.showWarnings(cart);
      })
    );
  }

  updateCart(items: UpdateCartItemDto[]): Observable<CartResponse> {
    return this.http.post<CartResponse>(this.baseUrl, { items }).pipe(
      tap((res) => {
        if (res && res.items) {
          this.updateLocalState(res.items);
          this.broadcastChannel.postMessage({ type: 'UPDATE', items: res.items });
        }
        this.showWarnings(res);
      })
    );
  }

  clearCart(): Observable<CartResponse> {
    return this.http.delete<CartResponse>(this.baseUrl).pipe(
      tap(() => {
        this.updateLocalState([]);
        this.broadcastChannel.postMessage({ type: 'UPDATE', items: [] });
      })
    );
  }

  addToCart(productId: number, quantity: number = 1): Observable<CartResponse> {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find((i) => i.productId === productId);
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    const updatedItems = existingItem
      ? currentItems.map(i => i.productId === productId
        ? { productId: i.productId, quantity: newQuantity }
        : { productId: i.productId, quantity: i.quantity })
      : [...currentItems.map(i => ({ productId: i.productId, quantity: i.quantity })), { productId, quantity }];

    return this.updateCart(updatedItems);
  }

  decreaseFromCart(productId: number): Observable<CartResponse> {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find((i) => i.productId === productId);

    if (existingItem && existingItem.quantity > 1) {
      const updatedItems = currentItems.map(i => i.productId === productId
        ? { productId: i.productId, quantity: i.quantity - 1 }
        : { productId: i.productId, quantity: i.quantity });
      return this.updateCart(updatedItems);
    } else if (existingItem) {
      return this.removeFromCart(productId);
    }

    return this.updateCart(currentItems.map(i => ({ productId: i.productId, quantity: i.quantity })));
  }

  removeFromCart(productId: number): Observable<CartResponse> {
    const currentItems = this.cartItems().filter((i) => i.productId !== productId);
    return this.updateCart(currentItems.map(i => ({ productId: i.productId, quantity: i.quantity })));
  }
}
