import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class OrderItemsService {
  private readonly baseUrl: string = environment.url + 'api/OrderItems/';
  private http = inject(HttpClient);

  AddOrderItems(orderItems:any):Observable<any>{
    return this.http.post(this.baseUrl,orderItems);
  }
  UpdateOrderItems(id:string,orderItems:any):Observable<any>{
    return this.http.put(this.baseUrl + id,orderItems);
  }
  DeleteOrderItems(id:string):Observable<any>{
    return this.http.delete(this.baseUrl + id);
  }
  
}
