//Angular Imports
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//Libraries
import { Observable } from 'rxjs';
//Environment
import { environment } from '../../../environments/environment';
//Models
import { AddressSummaryDto, CreateAddressRequest, UpdateAddressRequest } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    //Angular
    private readonly http = inject(HttpClient);

    //Config
    private readonly baseUrl = `${environment.url}/api/Addresses`;

    // ==================== Address Methods ====================

    getUserAddresses(): Observable<AddressSummaryDto[]> {
        return this.http.get<AddressSummaryDto[]>(this.baseUrl);
    }

    addAddress(address: CreateAddressRequest): Observable<AddressSummaryDto> {
        return this.http.post<AddressSummaryDto>(this.baseUrl, address);
    }

    updateAddress(addressId: number, address: UpdateAddressRequest): Observable<AddressSummaryDto> {
        return this.http.put<AddressSummaryDto>(`${this.baseUrl}/${addressId}`, address);
    }

    deleteAddress(addressId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${addressId}`);
    }

    setDefaultAddress(addressId: number): Observable<AddressSummaryDto[]> {
        return this.http.put<AddressSummaryDto[]>(`${this.baseUrl}/${addressId}/set-default`, {});
    }
}
