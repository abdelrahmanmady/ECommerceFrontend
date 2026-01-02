//Angular Imports
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
//Libraries
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
//Environment
import { environment } from '../../../environments/environment';
//Services
import { CartService } from './cart.service';
//Models
import { AuthResponse, LoginRequest, RegisterRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = `${environment.url}/api/auth/`;
  //Angular
  private readonly router = inject(Router);
  //Libraries
  private readonly toastr = inject(ToastrService);
  //Services
  private readonly cartService = inject(CartService);

  //State
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

  updateAvatarUrl(avatarUrl: string | undefined): void {
    const currentUser = this.user();
    if (currentUser) {
      this.user.set({ ...currentUser, avatarUrl });
    }
  }
}
