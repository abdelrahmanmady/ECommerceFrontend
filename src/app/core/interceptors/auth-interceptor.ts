import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services';
import { isTokenExpired } from '../../utils/checkToken';
import { catchError, switchMap, of } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  req = req.clone({ withCredentials: true });

  if (req.url.includes('refresh-token') || req.url.includes('login') || req.url.includes('register')) {
    return next(req);
  }
  
  
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return next(req);
  }

  if (!isTokenExpired(token)) {
    return next(
      req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    );
  }

  // token expired
  return authService.refreshToken().pipe(
    switchMap((res) => {
      localStorage.setItem('accessToken', res.accessToken);

      return next(
        req.clone({
          setHeaders: {
            Authorization: `Bearer ${res.accessToken}`
          }
        })
      );
    }),
    catchError((err) => {
      // authService.logout();
      return of(err);
    })
  );
};
