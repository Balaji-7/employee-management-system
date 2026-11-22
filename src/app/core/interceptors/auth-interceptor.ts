import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError
} from 'rxjs';
import { AuthService } from '../auth/auth-service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();

  const isAuthRequest =
    req.url.endsWith('/auth/login') ||
    req.url.endsWith('/auth/refresh');

  if (isAuthRequest || !req.url.startsWith('https://dummyjson.com/')) {
    return next(req);
  }

  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
    : req;

  return next(authReq).pipe(
    catchError(error => {
      if (error.status !== 401 || !authService.getRefreshToken()) {
        return throwError(() => error);
      }

      // Another request is already refreshing the token.
      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter(newToken => newToken !== null),
          take(1),
          switchMap(newToken => {
            if (!newToken) {
              return throwError(() => error);
            }

            return next(req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            }));
          })
        );
      }

      // Start a new refresh operation.
      isRefreshing = true;
      refreshTokenSubject.next(null);

      return authService.refreshSession().pipe(
        switchMap(response => {
          isRefreshing = false;
          refreshTokenSubject.next(response.accessToken);

          return next(req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.accessToken}`
            }
          }));
        }),
        catchError(refreshError => {
          isRefreshing = false;
          refreshTokenSubject.next('');

          authService.logout();
          router.navigate(['/login']);

          return throwError(() => refreshError);
        })
      );
    })
  );
};