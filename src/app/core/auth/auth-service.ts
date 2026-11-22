import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}
export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://dummyjson.com/auth';

  currentUser = signal<AuthResponse | null>(null);

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      {
        ...credentials,
        expiresInMins: 1
      }
    ).pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        this.currentUser.set(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    this.currentUser.set(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
  refreshSession(): Observable<RefreshResponse> {
  const refreshToken = this.getRefreshToken();

  return this.http.post<RefreshResponse>(
    `${this.apiUrl}/refresh`,
    {
      refreshToken,
      expiresInMins: 30
    }
  ).pipe(
    tap(response => {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    })
  );
}
getCurrentUser(): Observable<any> {
  return this.http.get(`${this.apiUrl}/me`);
}
restoreSession(): void {
  const token = this.getAccessToken();

  if (!token) {
    return;
  }

  this.getCurrentUser().subscribe({
    next: user => this.currentUser.set(user),
    error: () => this.logout()
  });
}
}
