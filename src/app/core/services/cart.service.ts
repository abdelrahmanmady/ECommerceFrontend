import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly baseUrl: string = `${environment.url}/api/Cart`;
  private http = inject(HttpClient);

  cartItems = signal<any[]>([]);
  private cartCount = signal(0);
  private broadcastChannel = new BroadcastChannel('cart_sync');

  constructor() {
    this.broadcastChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'UPDATE') {
        this.updateLocalState(event.data.items);
      }
    };

    // Initial fetch only if user is authenticated
    if (localStorage.getItem('accessToken')) {
      this.getUserCart().subscribe();
    }
  }

  setCartCount(count: number) {
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

  private updateLocalState(items: any[]) {
    this.cartItems.set(items);
    const totalCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    this.setCartCount(totalCount);
  }

  // for cart
  getUserCart(): Observable<any> {
    return this.http.get<any>(this.baseUrl).pipe(
      tap((cart) => {
        if (cart && cart.items) {
          this.updateLocalState(cart.items);
        }
      })
    );
  }

  updateCart(items: any[]): Observable<any> {
    return this.http.post<any>(this.baseUrl, { items }).pipe(
      tap((res) => {
        if (res && res.items) {
          this.updateLocalState(res.items);
          this.broadcastChannel.postMessage({ type: 'UPDATE', items: res.items });
        }
      })
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(this.baseUrl).pipe(
      tap(() => {
        const empty: any[] = [];
        this.updateLocalState(empty);
        this.broadcastChannel.postMessage({ type: 'UPDATE', items: empty });
      })
    );
  }

  // Helper to add item
  addToCart(productId: number, quantity: number = 1): Observable<any> {
    // Optimistic / Local-First Approach
    const currentItems = [...this.cartItems()]; // access signal directly
    const existingItem = currentItems.find((i: any) => i.productId === productId);

    if (existingItem) {
      // Create a shallow copy of the item to avoid mutating the original array directly before reassignment logic (though we copied array)
      // Actually simpler: rebuild object or edit clone.
      // Since currentItems IS a fresh array from spread, we can mutate object if we are careful, 
      // but better to map it to be immutable-ish style.
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ productId, quantity });
    }

    return this.updateCart(currentItems);
  }

  removeFromCart(productId: number): Observable<any> {
    const currentItems = this.cartItems().filter((i: any) => i.productId !== productId);
    return this.updateCart(currentItems);
  }
}
