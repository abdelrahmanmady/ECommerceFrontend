import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 0:
            errorMessage = 'Network error: Cannot reach the server.';
            break;
          case 400:
            errorMessage = 'Bad Request (400)';
            break;
          case 401:
            errorMessage = 'Unauthorized (401)';
            break;
          case 403:
            errorMessage = 'Forbidden (403)';
            break;
          case 404:
            errorMessage = 'Not Found (404)';
            break;
          case 500:
            errorMessage = 'Server Error (500)';
            break;
          default:
            errorMessage = `Unexpected Error: ${error.status}`;
        }
      }

      console.error('API Error:', error);
      alert(errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
