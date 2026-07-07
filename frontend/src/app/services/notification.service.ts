import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Notification, User } from '../models/fase1.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PaginatedData<T> {
  data: T[];
}

interface RawUser extends Partial<User> {
  id: number;
  name: string;
  profile_photo_url?: string | null;
  cover_photo_url?: string | null;
}

interface RawNotification {
  id: number;
  recipient_id: number;
  sender: RawUser | null;
  type: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at?: string | null;
}

const API_URL = 'http://localhost:8000/api';
const BACKEND_URL = 'http://localhost:8000';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private readonly http: HttpClient) {}

  readonly contagemNaoLidas = signal(0);

  getNotifications(): Observable<Notification[]> {
    return this.http
      .get<ApiResponse<RawNotification[] | PaginatedData<RawNotification>>>(
        `${API_URL}/notifications`,
      )
      .pipe(
        map((response) =>
          this.unwrapArray(response.data).map((n) => this.toNotification(n)),
        ),
        tap((lista) => this.contagemNaoLidas.set(lista.filter((n) => !n.is_read).length)),
      );
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http
      .patch<ApiResponse<RawNotification>>(`${API_URL}/notifications/${id}/read`, null)
      .pipe(
        map((response) => this.toNotification(response.data)),
        tap(() => this.contagemNaoLidas.update((valor) => Math.max(0, valor - 1))),
      );
  }

  private unwrapArray<T>(payload: T[] | PaginatedData<T>): T[] {
    return Array.isArray(payload) ? payload : payload.data;
  }

  private toNotification(n: RawNotification): Notification {
    return {
      id: n.id,
      recipient_id: n.recipient_id,
      sender: n.sender ? this.toUser(n.sender) : null,
      type: n.type,
      data: n.data ?? {},
      is_read: n.is_read ?? false,
      created_at: n.created_at ?? '',
    };
  }

  private toUser(user: RawUser): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email ?? null,
      profile_photo: this.absoluteUrl(user.profile_photo_url ?? user.profile_photo ?? null),
      cover_photo: this.absoluteUrl(user.cover_photo_url ?? user.cover_photo ?? null),
      bio: user.bio ?? null,
      is_private: user.is_private ?? false,
      is_following: user.is_following ?? false,
      followers_count: user.followers_count ?? 0,
      following_count: user.following_count ?? 0,
      posts_count: user.posts_count ?? 0,
      role: user.role ?? 'user',
    };
  }

  private absoluteUrl(url: string | null): string | null {
    if (!url) return null;
    return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
  }
}
