import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Address, AddressRequest } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    private readonly baseUrl: string = `${environment.url}/api/Addresses`;
    private http = inject(HttpClient);

    getUserAddresses(): Observable<Address[]> {
        return this.http.get<Address[]>(this.baseUrl);
    }

    addAddress(address: AddressRequest): Observable<Address> {
        return this.http.post<Address>(this.baseUrl, address);
    }
}
