import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError } from '../models/api-error.model';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = getErrorMessage(error);

      const isRefreshToken = req.url.includes('refresh-token');
      const isRegisterValidation = req.url.includes('auth/register') &&
        (error.status === 400 || error.status === 409);
      const isLoginError = req.url.includes('auth/login') && error.status === 401;

      if (!isRefreshToken && !isRegisterValidation && !isLoginError) {
        toastr.error(errorMessage);
      }
      return throwError(() => error);
    })
  );
};

/**
 * Extracts error message from backend's unified error response
 */
function getErrorMessage(error: HttpErrorResponse): string {
  const apiError = error.error as ApiError;

  // Use the backend's unified error message
  if (apiError?.message) {
    return apiError.message;
  }

  // Fallback for detail if message is empty
  if (apiError?.detail) {
    return apiError.detail;
  }

  // Network error fallback
  if (error.status === 0) {
    return 'Unable to connect to server. Please check your internet connection.';
  }

  // Generic fallback
  return 'An unexpected error occurred. Please try again.';
}
