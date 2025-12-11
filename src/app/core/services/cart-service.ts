import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly baseUrl: string = environment.url + 'api/ShoppingCart/';
  private http = inject(HttpClient);
  cartCount = signal(0);

  getAllCarts():Observable<any> {
    return this.http.get(this.baseUrl);
  }
  getCartById(id:string):Observable<any>{
    return this.http.get(this.baseUrl + id);
  }
  getCartByUserId(userId:string):Observable<any>{
    return this.http.get(this.baseUrl + 'user/' + userId);
  } 
  setCartCount(count: number) {
    this.cartCount.set(count);
  }
}
