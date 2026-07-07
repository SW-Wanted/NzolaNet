import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../models/fase1.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PaginatedData<T> {
  data: T[];
  meta?: {
    current_page?: number;
    last_page?: number;
    total?: number;
  };
  current_page?: number;
  last_page?: number;
  total?: number;
}

interface RawUser extends Partial<User> {
  id: number;
  name: string;
  profile_photo_url?: string | null;
  cover_photo_url?: string | null;
}

interface RawPost {
  id: number;
  content: string;
  image?: string | null;
  image_url?: string | null;
  video?: string | null;
  video_url?: string | null;
  likes_count?: number;
  comments_count?: number;
  author?: RawUser;
  created_at?: string | null;
  published_at?: string | null;
}

export type EstadoDenuncia = 'pendente' | 'aceite' | 'rejeitada';
export type TipoAlvoDenuncia = 'publicacao' | 'comentario';

export interface DenunciaAdmin {
  id: number;
  tipoAlvo: TipoAlvoDenuncia;
  motivo: string;
  descricao: string;
  estado: EstadoDenuncia;
  conteudo: string;
  imagemConteudo: string | null;
  autorConteudoId: number | null;
  autorConteudo: string;
  autorConteudoAvatar: string;
  denunciante: string;
  denuncianteAvatar: string;
  data: string;
}

export interface BazeRecenteAdmin {
  id: number;
  utilizador: string;
  autorPublicacao: string;
  data: string;
}

export interface PublicacaoTopoAdmin {
  id: number;
  autor: string;
  autorAvatar: string;
  conteudo: string;
  bazes: number;
}

export interface AdminDashboard {
  totals: {
    users: number;
    active_users: number;
    inactive_users: number;
    posts: number;
    comments: number;
    likes: number;
    reports: number;
    pending_reports: number;
  };
  recent_reports: DenunciaAdmin[];
  top_posts: PublicacaoTopoAdmin[];
  recent_likes: BazeRecenteAdmin[];
}

const API_URL = 'http://localhost:8000/api';
const BACKEND_URL = 'http://localhost:8000';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private readonly http: HttpClient) {}

  getDashboard(): Observable<AdminDashboard> {
    return this.http.get<ApiResponse<any>>(`${API_URL}/admin/dashboard`).pipe(
      map((response) => ({
        totals: response.data.totals,
        recent_reports: this.unwrapArray(response.data.recent_reports).map((report: any) =>
          this.toDenuncia(report),
        ),
        top_posts: this.unwrapArray<RawPost>(response.data.top_posts).map((post) =>
          this.toPublicacaoTopo(post),
        ),
        recent_likes: (response.data.recent_likes ?? []).map((like: any) => ({
          id: like.id,
          utilizador: like.user ?? 'Utilizador',
          autorPublicacao: like.post_author ?? 'Publicação',
          data: like.created_at ?? '',
        })),
      })),
    );
  }

  getUsersPage(page: number, perPage = 20): Observable<{ users: User[]; lastPage: number; total: number; currentPage: number }> {
    return this.http.get<ApiResponse<PaginatedData<RawUser>>>(`${API_URL}/admin/users?page=${page}&per_page=${perPage}`).pipe(
      map((response) => {
        const payload = response.data;
        const meta = payload.meta ?? payload;

        return {
          users: this.unwrapArray(payload).map((user: RawUser) => this.toUser(user)),
          lastPage: meta.last_page ?? 1,
          total: meta.total ?? this.unwrapArray(payload).length,
          currentPage: meta.current_page ?? page,
        };
      }),
    );
  }

  setUserActive(userId: number, isActive: boolean): Observable<User> {
    return this.http
      .patch<ApiResponse<RawUser>>(`${API_URL}/admin/users/${userId}/active`, { is_active: isActive })
      .pipe(map((response) => this.toUser(response.data)));
  }

  setUserRole(userId: number, role: 'admin' | 'user'): Observable<User> {
    return this.http
      .patch<ApiResponse<RawUser>>(`${API_URL}/admin/users/${userId}/role`, { role })
      .pipe(map((response) => this.toUser(response.data)));
  }

  deleteUser(userId: number): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${API_URL}/admin/users/${userId}`)
      .pipe(map(() => undefined));
  }

  getReports(status?: EstadoDenuncia): Observable<DenunciaAdmin[]> {
    const query = status ? `?status=${status}` : '';

    return this.http.get<ApiResponse<PaginatedData<any>>>(`${API_URL}/admin/reports${query}`).pipe(
      map((response) => this.unwrapArray(response.data).map((report: any) => this.toDenuncia(report))),
    );
  }

  resolveReport(id: number, action: 'aceitar' | 'rejeitar' | 'apagar'): Observable<DenunciaAdmin> {
    return this.http
      .patch<ApiResponse<any>>(`${API_URL}/admin/reports/${id}/resolve`, { action })
      .pipe(map((response) => this.toDenuncia(response.data)));
  }

  private unwrapArray<T>(payload: T[] | PaginatedData<T>): T[] {
    return Array.isArray(payload) ? payload : payload.data ?? [];
  }

  private toDenuncia(report: any): DenunciaAdmin {
    const tipo = (report.tipoAlvo ?? report.type) === 'comentario' ? 'comentario' : 'publicacao';
    const autor = report.content_author ?? {};
    const reporter = report.reporter ?? {};

    return {
      id: report.id,
      tipoAlvo: tipo,
      motivo: report.motivo ?? report.reason ?? 'Denúncia',
      descricao: report.descricao ?? report.description ?? '',
      estado: (report.estado ?? report.status ?? 'pendente') as EstadoDenuncia,
      conteudo: report.conteudo ?? report.content ?? '',
      imagemConteudo: this.absoluteUrl(report.imagemConteudo ?? report.image_url ?? null),
      autorConteudoId: report.autorConteudoId ?? autor.id ?? null,
      autorConteudo: report.autorConteudo ?? autor.name ?? 'Utilizador',
      autorConteudoAvatar:
        this.absoluteUrl(report.autorConteudoAvatar ?? autor.profile_photo_url ?? autor.profile_photo ?? null) ??
        this.avatarFallback(report.autorConteudo ?? autor.name ?? 'Utilizador'),
      denunciante: report.denunciante ?? reporter.name ?? 'Utilizador',
      denuncianteAvatar:
        this.absoluteUrl(report.denuncianteAvatar ?? reporter.profile_photo_url ?? reporter.profile_photo ?? null) ??
        this.avatarFallback(report.denunciante ?? reporter.name ?? 'Utilizador'),
      data: report.data ?? report.created_at ?? '',
    };
  }

  private toPublicacaoTopo(post: RawPost): PublicacaoTopoAdmin {
    const author = post.author;

    return {
      id: post.id,
      autor: author?.name ?? 'Utilizador',
      autorAvatar:
        this.absoluteUrl(author?.profile_photo_url ?? author?.profile_photo ?? null) ??
        this.avatarFallback(author?.name ?? 'Utilizador'),
      conteudo: post.content,
      bazes: post.likes_count ?? 0,
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
      is_active: user.is_active ?? true,
      is_following: user.is_following ?? false,
      followers_count: user.followers_count ?? 0,
      following_count: user.following_count ?? 0,
      posts_count: user.posts_count ?? 0,
      role: user.role ?? 'user',
      created_at: user.created_at ?? undefined,
    };
  }

  private absoluteUrl(url: string | null): string | null {
    if (!url) {
      return null;
    }

    return url.startsWith('http') || url.startsWith('data:') ? url : `${BACKEND_URL}${url}`;
  }

  private avatarFallback(name: string): string {
    return `https://ui-avatars.com/api/?background=111827&color=ffffff&name=${encodeURIComponent(name)}`;
  }
}
