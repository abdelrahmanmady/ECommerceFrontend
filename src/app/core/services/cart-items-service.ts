import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class CartItemsService {
  private readonly baseUrl: string = environment.url + 'api/CartItem/';
  private http = inject(HttpClient);

  AddCartItems(cartItems:any):Observable<any>{
    return this.http.post(this.baseUrl,cartItems);
  }
  UpdateCartItems(id:string,quantity:any):Observable<any>{
    return this.http.put(this.baseUrl + id,quantity);
  }
  DeleteCartItems(id:string):Observable<any>{
    return this.http.delete(this.baseUrl + id);
  }
}
