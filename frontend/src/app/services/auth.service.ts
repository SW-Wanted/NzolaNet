import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, computed, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { AuthResponse, User } from '../models/fase1.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface LaravelUserPayload extends Partial<User> {
  id: number;
  name: string;
  profile_photo_url?: string | null;
}

interface LaravelAuthPayload {
  user: LaravelUserPayload;
  access_token?: string;
  token?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const API_URL = 'http://localhost:8000/api';
const TOKEN_KEY = 'nzolanet.auth.token';
const USER_KEY = 'nzolanet.auth.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authState = signal<AuthState>({ token: null, user: null });

  readonly currentUser = computed(() => this.authState().user);
  readonly isAuthenticated = computed(() =>
    Boolean(this.authState().token && this.authState().user),
  );

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
  ) {
    this.authState.set({
      token: this.readTokenFromStorage(),
      user: this.readUserFromStorage(),
    });
  }

  get token(): string | null {
    return this.authState().token;
  }

  login(credentials: LoginPayload): Observable<AuthResponse> {
    return this.http
      .post<ApiResponse<LaravelAuthPayload>>(`${API_URL}/auth/login`, credentials)
      .pipe(
        map((response) => this.toAuthResponse(response.data)),
        tap((authResponse) => this.persistSession(authResponse)),
      );
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http
      .post<ApiResponse<LaravelAuthPayload>>(`${API_URL}/auth/register`, payload)
      .pipe(
        map((response) => this.toAuthResponse(response.data)),
        tap((authResponse) => this.persistSession(authResponse)),
      );
  }

  logout(): Observable<void> {
    return this.http.post<ApiResponse<null>>(`${API_URL}/auth/logout`, null).pipe(
      map(() => undefined),
      tap(() => this.clearSession()),
    );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<ApiResponse<LaravelAuthPayload>>(`${API_URL}/auth/refresh`, null).pipe(
      map((response) => this.toAuthResponse(response.data)),
      tap((authResponse) => this.persistSession(authResponse)),
    );
  }

  getCurrentUserFromServer(): Observable<User> {
    return this.http.get<ApiResponse<LaravelUserPayload>>(`${API_URL}/auth/me`).pipe(
      map((response) => this.toUser(response.data)),
      tap((user) => this.persistUser(user)),
    );
  }

  clearSession(): void {
    this.authState.set({ token: null, user: null });

    if (!this.isBrowser()) {
      return;
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private persistSession(authResponse: AuthResponse): void {
    this.authState.set({ token: authResponse.token, user: authResponse.user });

    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
  }

  private persistUser(user: User): void {
    this.authState.update((state) => ({ ...state, user }));

    if (this.isBrowser()) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  private readTokenFromStorage(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem(TOKEN_KEY);
  }

  private readUserFromStorage(): User | null {
    if (!this.isBrowser()) {
      return null;
    }

    const rawUser = localStorage.getItem(USER_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      return this.toUser(JSON.parse(rawUser) as LaravelUserPayload);
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }

  private toAuthResponse(payload: LaravelAuthPayload): AuthResponse {
    return {
      token: payload.access_token ?? payload.token ?? '',
      user: this.toUser(payload.user),
    };
  }

  private toUser(user: LaravelUserPayload): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email ?? null,
      profile_photo: user.profile_photo_url ?? user.profile_photo ?? null,
      bio: user.bio ?? null,
      followers_count: user.followers_count ?? 0,
      following_count: user.following_count ?? 0,
      posts_count: user.posts_count ?? 0,
      role: user.role ?? 'user',
    };
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
