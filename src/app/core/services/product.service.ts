import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductsResponse, ProductQueryParams, ProductDetails } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl: string = `${environment.url}/api/Products`;
  private readonly http = inject(HttpClient);

  getAllProducts(filters?: ProductQueryParams): Observable<ProductsResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.pageIndex) {
        params = params.append('PageIndex', filters.pageIndex.toString());
      }
      if (filters.pageSize) {
        params = params.append('PageSize', filters.pageSize.toString());
      }
      if (filters.categoryId) {
        params = params.append('CategoryId', filters.categoryId.toString());
      }
      if (filters.brandsIds) {
        params = params.append('BrandsIds', filters.brandsIds);
      }
      if (filters.search) {
        params = params.append('Search', filters.search);
      }
      if (filters.minPrice !== undefined && filters.minPrice > 0) {
        params = params.append('MinPrice', filters.minPrice.toString());
      }
      if (filters.maxPrice !== undefined && filters.maxPrice < 5000) {
        params = params.append('MaxPrice', filters.maxPrice.toString());
      }
      if (filters.sort) {
        params = params.append('Sort', filters.sort);
      }
    }

    return this.http.get<ProductsResponse>(this.baseUrl, { params });
  }

  getProductById(id: number): Observable<ProductDetails> {
    return this.http.get<ProductDetails>(`${this.baseUrl}/${id}`);
  }

  addProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
