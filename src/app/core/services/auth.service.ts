import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/authentication.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = `${environment.url}/api/auth/`;
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly cartService = inject(CartService);

  user = signal<Omit<AuthResponse, 'accessToken'> | null>(null);

  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}login`, request);
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}register`, request);
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}refresh-token`, {});
  }

  logout(): void {
    this.http.post<void>(`${this.baseUrl}revoke-token`, {}).subscribe({
      next: () => {
        this.clearAuthState();
        this.toastr.success('Logout successful!');
        this.router.navigate(['/home']);
      },
      error: () => {
        this.clearAuthState();
        this.toastr.warning('Logged out locally.');
        this.router.navigate(['/home']);
      }
    });
  }

  setAuthState(response: AuthResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    const { accessToken, ...userData } = response;
    this.user.set(userData);
  }

  clearAuthState(): void {
    localStorage.removeItem('accessToken');
    this.user.set(null);
    this.cartService.clearLocalCart();
  }
}
