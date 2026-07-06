import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../models/fase1.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface RawUser extends Partial<User> {
  id: number;
  name: string;
  profile_photo_url?: string | null;
}

const API_URL = 'http://localhost:8000/api';
const BACKEND_URL = 'http://localhost:8000';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private readonly http: HttpClient) {}

  getUserProfile(id: number): Observable<User> {
    return this.http
      .get<ApiResponse<RawUser>>(`${API_URL}/users/${id}`)
      .pipe(map((response) => this.toUser(response.data)));
  }

  getUsers(perPage = 50): Observable<User[]> {
    return this.http
      .get<ApiResponse<RawUser[] | { data: RawUser[] }>>(`${API_URL}/users?per_page=${perPage}`)
      .pipe(map((response) => this.unwrapArray(response.data).map((user) => this.toUser(user))));
  }

  getUsersPage(page: number, perPage = 20): Observable<{ users: User[]; lastPage: number; total: number; currentPage: number }> {
    return this.http
      .get<any>(`${API_URL}/users?page=${page}&per_page=${perPage}`)
      .pipe(
        map((response) => {
          const outer = response?.data ?? response;
          const items: RawUser[] = Array.isArray(outer)
            ? outer
            : Array.isArray(outer?.data)
              ? outer.data
              : [];
          const meta = outer?.meta ?? outer;
          return {
            users: items.map((u: RawUser) => this.toUser(u)),
            lastPage: meta?.last_page ?? 1,
            total: meta?.total ?? items.length,
            currentPage: meta?.current_page ?? page,
          };
        }),
      );
  }

  updateProfile(data: Partial<User>): Observable<User> {
    const payload = {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
      ...(data.is_private !== undefined ? { is_private: data.is_private } : {}),
    };

    return this.http
      .put<ApiResponse<RawUser>>(`${API_URL}/users/profile`, payload)
      .pipe(map((response) => this.toUser(response.data)));
  }

  uploadProfilePhoto(file: File): Observable<{ photo_url: string }> {
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.post<ApiResponse<RawUser>>(`${API_URL}/users/profile-photo`, formData).pipe(
      map((response) => ({
        photo_url: this.absoluteUrl(response.data.profile_photo_url ?? response.data.profile_photo ?? null) ?? '',
      })),
    );
  }

  toggleFollow(userId: number): Observable<void> {
    return this.http
      .post<ApiResponse<null>>(`${API_URL}/users/${userId}/follow`, null)
      .pipe(map(() => undefined));
  }

  unfollow(userId: number): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${API_URL}/users/${userId}/follow`)
      .pipe(map(() => undefined));
  }

  getFollowers(userId: number): Observable<User[]> {
    return this.http
      .get<ApiResponse<RawUser[] | { data: RawUser[] }>>(`${API_URL}/users/${userId}/followers`)
      .pipe(map((response) => this.unwrapArray(response.data).map((user) => this.toUser(user))));
  }

  getFollowing(userId: number): Observable<User[]> {
    return this.http
      .get<ApiResponse<RawUser[] | { data: RawUser[] }>>(`${API_URL}/users/${userId}/following`)
      .pipe(map((response) => this.unwrapArray(response.data).map((user) => this.toUser(user))));
  }


  private unwrapArray<T>(payload: T[] | { data: T[] }): T[] {
    return Array.isArray(payload) ? payload : payload.data;
  }

  private toUser(user: RawUser): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email ?? null,
      profile_photo: this.absoluteUrl(user.profile_photo_url ?? user.profile_photo ?? null),
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
    if (!url) {
      return null;
    }

    return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
  }
}
