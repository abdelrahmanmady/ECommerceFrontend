//Angular Imports
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
//Libraries
import { Observable } from 'rxjs';
//Environment
import { environment } from '../../../environments/environment';
//Models
import {
  AdminCategoryDetailsResponse,
  AdminCategoryQueryParams,
  AdminCategorySummaryDto,
  CategorySummaryDto,
} from '../models';
import { PagedResponse } from '../models/paged-response.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly baseUrl: string = `${environment.url}/api/Categories`;
  //Angular
  private readonly http = inject(HttpClient);

  getAllStoreCategories(): Observable<CategorySummaryDto[]> {
    return this.http.get<CategorySummaryDto[]>(this.baseUrl);
  }

  getAdminCategories(
    queryParams?: AdminCategoryQueryParams,
  ): Observable<PagedResponse<AdminCategorySummaryDto>> {
    let params = new HttpParams();

    if (queryParams) {
      if (queryParams.type) {
        params = params.set('type', queryParams.type);
      }
      if (queryParams.search) {
        params = params.set('search', queryParams.search);
      }
      if (queryParams.pageIndex) {
        params = params.set('pageIndex', queryParams.pageIndex.toString());
      }
      if (queryParams.pageSize) {
        params = params.set('pageSize', queryParams.pageSize.toString());
      }
    }

    return this.http.get<PagedResponse<AdminCategorySummaryDto>>(`${this.baseUrl}/admin`, {
      params,
    });
  }

  getAdminCategoryDetails(categoryId: number): Observable<AdminCategoryDetailsResponse> {
    return this.http.get<AdminCategoryDetailsResponse>(`${this.baseUrl}/admin/${categoryId}`);
  }
}
