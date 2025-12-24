import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CheckoutPreviewResponse, PlaceOrderRequest } from '../models';

@Injectable({
    providedIn: 'root'
})
export class CheckoutService {
    private readonly baseUrl: string = `${environment.url}/api/Checkout`;
    private http = inject(HttpClient);

    getCheckoutPreview(shippingMethod: string): Observable<CheckoutPreviewResponse> {
        return this.http.get<CheckoutPreviewResponse>(`${this.baseUrl}/preview`, {
            params: { shippingMethod }
        });
    }

    placeOrder(request: PlaceOrderRequest): Observable<any> {
        return this.http.post(`${this.baseUrl}`, request);
    }
}
