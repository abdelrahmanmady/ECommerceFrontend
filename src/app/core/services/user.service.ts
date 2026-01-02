import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDetailsResponse, UpdateUserRequest, UpdatePasswordRequest } from '../models/user.model';
import { AuthResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.url}/api/Users`;

    getUserDetails(): Observable<UserDetailsResponse> {
        return this.http.get<UserDetailsResponse>(this.baseUrl);
    }

    updateUser(request: UpdateUserRequest): Observable<AuthResponse> {
        return this.http.put<AuthResponse>(this.baseUrl, request);
    }

    updatePassword(request: UpdatePasswordRequest): Observable<AuthResponse> {
        return this.http.put<AuthResponse>(`${this.baseUrl}/password`, request);
    }

    uploadAvatar(file: File): Observable<UserDetailsResponse> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.put<UserDetailsResponse>(`${this.baseUrl}/image`, formData);
    }

    deleteAvatar(): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/image`);
    }
}
