//Angular Imports
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
//Libraries
import { Observable } from 'rxjs';
//Environment
import { environment } from '../../../environments/environment';
//Models
import { OrderQueryParams, OrderSummaryDto, PagedResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    //Angular
    private readonly http = inject(HttpClient);

    //Config
    private readonly baseUrl = `${environment.url}/api/Orders`;

    // ==================== Order Methods ====================

    getOrders(queryParams?: OrderQueryParams): Observable<PagedResponse<OrderSummaryDto>> {
        let params = new HttpParams();

        if (queryParams) {
            if (queryParams.status) {
                params = params.set('status', queryParams.status);
            }
            if (queryParams.sort) {
                params = params.set('sort', queryParams.sort);
            }
            if (queryParams.pageIndex !== undefined) {
                params = params.set('pageIndex', queryParams.pageIndex.toString());
            }
            if (queryParams.pageSize !== undefined) {
                params = params.set('pageSize', queryParams.pageSize.toString());
            }
        }

        return this.http.get<PagedResponse<OrderSummaryDto>>(this.baseUrl, { params });
    }
}
