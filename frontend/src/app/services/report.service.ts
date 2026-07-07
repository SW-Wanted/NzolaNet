import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ReportPayload {
  motivo: string;
  descricao: string;
}

const API_URL = 'http://localhost:8000/api';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private readonly http: HttpClient) {}

  reportPost(postId: number, payload: ReportPayload): Observable<void> {
    return this.http
      .post<ApiResponse<unknown>>(`${API_URL}/posts/${postId}/report`, this.toApiPayload(payload))
      .pipe(map(() => undefined));
  }

  reportComment(commentId: number, payload: ReportPayload): Observable<void> {
    return this.http
      .post<ApiResponse<unknown>>(`${API_URL}/comments/${commentId}/report`, this.toApiPayload(payload))
      .pipe(map(() => undefined));
  }

  private toApiPayload(payload: ReportPayload): { reason: string; description: string | null } {
    return {
      reason: payload.motivo,
      description: payload.descricao.trim() || null,
    };
  }
}
