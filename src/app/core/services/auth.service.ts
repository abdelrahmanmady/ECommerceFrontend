import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly baseUrl: string = `${environment.url}/api/auth/`;

  user = signal<any>(null);

  constructor(private http: HttpClient) {}

  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post(`${this.baseUrl}login`, { identifier: email, password, rememberMe });
  }

  register(firstName: string, lastName: string, userName: string, email: string, phoneNumber: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}register`, { firstName, lastName, userName, email, phoneNumber, password });
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.baseUrl}refresh-token`, {});
  }

  logout(): Observable<any> {
    localStorage.clear();
    return this.http.post(`${this.baseUrl}revoke-token`, {});
  }
  
}
