import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services';
import { isTokenExpired } from '../../utils/checkToken';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  req = req.clone({ withCredentials: true });

  if (req.url.includes('refresh-token') || req.url.includes('login') || req.url.includes('register')) {
    return next(req);
  }

  const token = localStorage.getItem('accessToken');
  if (!token) {
    return next(req);
  }

  if (!isTokenExpired(token)) {
    return next(addTokenToRequest(req, token));
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((res) => {
        isRefreshing = false;
        authService.setAuthState(res);
        refreshTokenSubject.next(res.accessToken);
        return next(addTokenToRequest(req, res.accessToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        refreshTokenSubject.next(null);
        authService.clearAuthState();
        toastr.warning('Your session has expired. Please log in again.');
        router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap((token) => next(addTokenToRequest(req, token)))
    );
  }
};

function addTokenToRequest(req: Parameters<HttpInterceptorFn>[0], token: string) {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}
