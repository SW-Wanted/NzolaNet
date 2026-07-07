export type UserRole = 'user' | 'admin' | string;

export interface User {
  id: number;
  name: string;
  email: string | null;
  profile_photo: string | null;
  cover_photo: string | null;
  bio: string | null;
  is_private?: boolean;
  is_active?: boolean;
  is_following?: boolean;
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
  likes_count?: number;
  liked_by_me?: boolean;
  can_update?: boolean;
  can_delete?: boolean;
  author: User;
  created_at: string;
}

export interface Comment {
  id: number;
  content: string;
  author: User;
  post_id: number;
  can_update?: boolean;
  can_delete?: boolean;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Notification {
  id: number;
  recipient_id: number;
  sender: User | null;
  type: 'like' | 'comment' | 'follow' | string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}
