import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { filter, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class Product {
  private readonly baseUrl: string = environment.url + 'api/Product/';
  private http = inject(HttpClient);

  getAllProducts(filters:any):Observable<any>{ 
    let params = new HttpParams();
    if(filters){
      if(filters.pageNum){
        params = params.append('pageNum', filters.pageNum);
      }
      if(filters.pageSize){
        params = params.append('pageSize', filters.pageSize);
      }
      if(filters.categoryId){
        params = params.append('category', filters.categoryId);
      }
      if(filters.serach){
        params = params.append('search', filters.serach);
      }
      if(filters.minPrice ){
        params = params.append('minPrice', filters.minPrice);
      }
      if(filters.maxPrice ){
        params = params.append('maxPrice', filters.maxPrice);
      }
    }

    return this.http.get(this.baseUrl,{params});
  }
  getProductById(id:string):Observable<any>{
    return this.http.get(this.baseUrl + id);
  }
  AddProduct(product:any):Observable<any>{
   return this.http.post(this.baseUrl,product);
  }
  UpdateProduct(id:string,product:any):Observable<any>{
    return this.http.put(this.baseUrl + id,product);
  }
  DeleteProduct(id:string):Observable<any>{
    return this.http.delete(this.baseUrl + id);
  }
}
