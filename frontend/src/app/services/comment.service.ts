import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Comment, User } from '../models/fase1.model';

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
}

interface RawComment {
  id: number;
  content: string;
  author: RawUser;
  post_id: number;
  can_update?: boolean;
  can_delete?: boolean;
  created_at?: string | null;
}

const API_URL = 'http://localhost:8000/api';
const BACKEND_URL = 'http://localhost:8000';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private readonly http: HttpClient) {}

  getComments(postId: number): Observable<Comment[]> {
    return this.http
      .get<
        ApiResponse<RawComment[] | PaginatedData<RawComment>>
      >(`${API_URL}/posts/${postId}/comments`)
      .pipe(
        map((response) =>
          this.unwrapArray(response.data).map((comment) => this.toComment(comment)),
        ),
      );
  }

  addComment(postId: number, content: string): Observable<Comment> {
    return this.http
      .post<ApiResponse<RawComment>>(`${API_URL}/posts/${postId}/comments`, { content })
      .pipe(map((response) => this.toComment(response.data)));
  }

  updateComment(id: number, content: string): Observable<Comment> {
    return this.http
      .put<ApiResponse<RawComment>>(`${API_URL}/comments/${id}`, { content })
      .pipe(map((response) => this.toComment(response.data)));
  }

  deleteComment(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${API_URL}/comments/${id}`)
      .pipe(map(() => undefined));
  }

  adminDeleteComment(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${API_URL}/admin/comments/${id}`)
      .pipe(map(() => undefined));
  }

  private unwrapArray<T>(payload: T[] | PaginatedData<T>): T[] {
    return Array.isArray(payload) ? payload : payload.data;
  }

  private toComment(comment: RawComment): Comment {
    return {
      id: comment.id,
      content: comment.content,
      author: this.toUser(comment.author),
      post_id: comment.post_id,
      can_update: comment.can_update ?? false,
      can_delete: comment.can_delete ?? false,
      created_at: comment.created_at ?? '',
    };
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

    return url.startsWith('http') || url.startsWith('data:') ? url : `${BACKEND_URL}${url}`;
  }
}
