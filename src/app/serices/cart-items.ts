import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartItems {
  private readonly baseUrl: string = environment.url + 'api/CartItems/';
  private http = inject(HttpClient);

  AddCartItems(cartItems:any){
    return this.http.post(this.baseUrl,cartItems);
  }
  UpdateCartItems(id:string,cartItems:any){
    return this.http.put(this.baseUrl + id,cartItems);
  }
  DeleteCartItems(id:string){
    return this.http.delete(this.baseUrl + id);
  }
}
