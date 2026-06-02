import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, map, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

let refreshTokenRequest$: Observable<string> | null = null;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.token;
  const authenticatedRequest = token ? withBearerToken(request, token) : request;

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      if (!shouldRefreshToken(error, request, authService)) {
        return throwError(() => error);
      }

      return refreshTokenOnce(authService).pipe(
        switchMap((newToken) => next(withBearerToken(request, newToken))),
        catchError((refreshError: unknown) => {
          authService.clearSession();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};

function withBearerToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function shouldRefreshToken(
  error: unknown,
  request: HttpRequest<unknown>,
  authService: AuthService,
): boolean {
  return (
    error instanceof HttpErrorResponse &&
    error.status === 401 &&
    Boolean(authService.token) &&
    !isRefreshRequest(request)
  );
}

function isRefreshRequest(request: HttpRequest<unknown>): boolean {
  return request.url.includes('/auth/refresh');
}

function refreshTokenOnce(authService: AuthService): Observable<string> {
  if (!refreshTokenRequest$) {
    refreshTokenRequest$ = authService.refreshToken().pipe(
      map((response) => response.token),
      finalize(() => {
        refreshTokenRequest$ = null;
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }

  return refreshTokenRequest$;
}
