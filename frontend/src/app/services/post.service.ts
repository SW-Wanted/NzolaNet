import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Post, User } from '../models/fase1.model';

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

interface RawPost {
  id: number;
  content: string;
  image?: string | null;
  image_url?: string | null;
  image_path?: string | null;
  video?: string | null;
  video_url?: string | null;
  video_path?: string | null;
  comments_count?: number;
  author: RawUser;
  created_at?: string | null;
  published_at?: string | null;
}

const API_URL = 'http://localhost:8000/api';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private readonly http: HttpClient) {}

  getGlobalFeed(): Observable<Post[]> {
    return this.http
      .get<ApiResponse<RawPost[] | PaginatedData<RawPost>>>(`${API_URL}/feed`)
      .pipe(map((response) => this.unwrapArray(response.data).map((post) => this.toPost(post))));
  }

  createPost(content: string, mediaFile?: File): Observable<Post> {
    const formData = new FormData();
    formData.append('content', content);

    if (mediaFile) {
      formData.append(this.mediaFieldName(mediaFile), mediaFile);
    }

    return this.http
      .post<ApiResponse<RawPost>>(`${API_URL}/posts`, formData)
      .pipe(map((response) => this.toPost(response.data)));
  }

  updatePost(id: number, content: string): Observable<Post> {
    return this.http
      .put<ApiResponse<RawPost>>(`${API_URL}/posts/${id}`, { content })
      .pipe(map((response) => this.toPost(response.data)));
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<ApiResponse<null>>(`${API_URL}/posts/${id}`).pipe(map(() => undefined));
  }

  private mediaFieldName(file: File): 'image' | 'video' {
    return file.type.startsWith('video/') ? 'video' : 'image';
  }

  private unwrapArray<T>(payload: T[] | PaginatedData<T>): T[] {
    return Array.isArray(payload) ? payload : payload.data;
  }

  private toPost(post: RawPost): Post {
    return {
      id: post.id,
      content: post.content,
      image: post.image ?? post.image_url ?? post.image_path ?? null,
      video: post.video ?? post.video_url ?? post.video_path ?? null,
      comments_count: post.comments_count ?? 0,
      author: this.toUser(post.author),
      created_at: post.created_at ?? post.published_at ?? '',
    };
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
