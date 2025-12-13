import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly baseUrl: string = `${environment.url}/api/Cart`;
  private http = inject(HttpClient);
  private cartCount = signal(0);

  setCartCount(count: number) {
    this.cartCount.set(count);
  }
  getCartCount(): number {
    return this.cartCount();
  }

  // for cart
  getUserCart():Observable<any> {
    return this.http.get(this.baseUrl);
  }
  clearCart(): Observable<any> {
    return this.http.delete(this.baseUrl);
  }

  //for cart items
  AddCartItem(productId:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/items/${productId}`,null);
  }

  DeleteCartItem(id:any):Observable<any>{
    return this.http.delete(`${this.baseUrl}/items/${id}`);
  }
}
