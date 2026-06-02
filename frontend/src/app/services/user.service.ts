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

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private readonly http: HttpClient) {}

  getUserProfile(id: number): Observable<User> {
    return this.http
      .get<ApiResponse<RawUser>>(`${API_URL}/users/${id}`)
      .pipe(map((response) => this.toUser(response.data)));
  }

  updateProfile(data: Partial<User>): Observable<User> {
    const payload = {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
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
        photo_url: response.data.profile_photo_url ?? response.data.profile_photo ?? '',
      })),
    );
  }

  toggleFollow(userId: number): Observable<void> {
    return this.http
      .post<ApiResponse<null>>(`${API_URL}/users/${userId}/follow`, null)
      .pipe(map(() => undefined));
  }

  private toUser(user: RawUser): User {
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
}
