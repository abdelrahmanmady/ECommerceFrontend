import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand.model';

@Injectable({
    providedIn: 'root',
})
export class BrandService {
    private readonly baseUrl: string = `${environment.url}/api/brands`;
    private readonly http = inject(HttpClient);

    getAllBrands(): Observable<Brand[]> {
        return this.http.get<Brand[]>(this.baseUrl);
    }

    getBrandById(id: number): Observable<Brand> {
        return this.http.get<Brand>(`${this.baseUrl}/${id}`);
    }
}
