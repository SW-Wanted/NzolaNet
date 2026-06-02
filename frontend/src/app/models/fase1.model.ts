export type UserRole = 'user' | 'admin' | string;

export interface User {
  id: number;
  name: string;
  email: string | null;
  profile_photo: string | null;
  bio: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  role: UserRole;
}

export interface Post {
  id: number;
  content: string;
  image: string | null;
  video: string | null;
  comments_count: number;
  author: User;
  created_at: string;
}

export interface Comment {
  id: number;
  content: string;
  author: User;
  post_id: number;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
