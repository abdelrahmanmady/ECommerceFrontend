import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, User } from '../models/user.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly baseUrl: string = `${environment.url}/api/auth/`;
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  user = signal<User | null>(null);

  constructor(private http: HttpClient) { }

  login(email: string, password: string, rememberMe: boolean): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}login`, { identifier: email, password, rememberMe });
  }

  register(firstName: string, lastName: string, userName: string, email: string, phoneNumber: string | null, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}register`, { firstName, lastName, userName, email, phoneNumber, password });
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}refresh-token`, {});
  }

  /**
   * Logs out the user: calls revoke-token API, clears state, shows toast, and redirects to home
   */
  logout(): void {
    this.http.post<void>(`${this.baseUrl}revoke-token`, {}).subscribe({
      next: () => {
        this.clearAuthState();
        this.toastr.success('Logout successful!');
        this.router.navigate(['/home']);
      },
      error: () => {
        // Force local logout even if API fails
        this.clearAuthState();
        this.toastr.warning('Logged out locally.');
        this.router.navigate(['/home']);
      }
    });
  }

  /**
   * Sets authentication state after successful login or token refresh
   */
  setAuthState(response: AuthResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    this.user.set(response.user);
  }

  /**
   * Clears all local authentication state (token, user signal)
   */
  clearAuthState(): void {
    localStorage.removeItem('accessToken');
    this.user.set(null);
  }
}




