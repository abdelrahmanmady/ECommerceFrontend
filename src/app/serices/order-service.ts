import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly baseUrl: string = environment.url + 'api/Order/';
  private http = inject(HttpClient);

  getAllOrders():Observable<any> {
    return this.http.get(this.baseUrl);
  }
  getOrderById(id:string):Observable<any>{
    return this.http.get(this.baseUrl + id);
  }
  getOrderByUserId(userId:string):Observable<any>{
    return this.http.get(this.baseUrl + 'user/' + userId);
  }
  AddOrder(order:any):Observable<any>{
    return this.http.post(this.baseUrl,order);
  }
  UpdateOrder(id:string,order:any):Observable<any>{
    return this.http.put(this.baseUrl + id,order);
  }
  DeleteOrder(id:string):Observable<any>{
    return this.http.delete(this.baseUrl + id);
  }
}
