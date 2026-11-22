import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      let errorMessage = 'Something went wrong. Please try again.';

      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server.';
      } else if (error.status === 400) {
        errorMessage = 'Invalid request. Please check your input.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized. Please login again.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        errorMessage = 'Requested resource not found.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      console.error('HTTP Error:', error.status, error.message);

      return throwError(() => ({
        ...error,
        userMessage: errorMessage
      }));
    })
  );
};