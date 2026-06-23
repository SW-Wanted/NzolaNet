import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Conversation, Message } from '../models/chat.model';

// TODO: Import HttpClient and API_URL once the backend chat API is ready.
// import { HttpClient } from '@angular/common/http';
// import { map } from 'rxjs/operators';
// import { API_URL } from '../app.config';
// import { ApiResponse } from '../models/fase1.model';

/**
 * Chat service — prepared for future backend integration.
 *
 * All methods return empty Observables until the backend implements:
 *   GET  /api/conversations
 *   GET  /api/conversations/{id}
 *   GET  /api/conversations/{id}/messages
 *   POST /api/conversations/{id}/messages
 *   PATCH /api/conversations/{id}/read
 *
 * See docs/CHAT_BACKEND_REQUIREMENTS.md for the full backend spec.
 */
@Injectable({ providedIn: 'root' })
export class ChatService {
  // TODO: Inject HttpClient when the API is available.
  // constructor(private readonly http: HttpClient) {}

  // TODO: Replace with the real base URL.
  // private readonly base = `${API_URL}/conversations`;

  /**
   * Returns the authenticated user's conversation list.
   *
   * TODO: Replace stub with real HTTP call once backend is ready:
   *   return this.http
   *     .get<ApiResponse<Conversation[]>>(this.base)
   *     .pipe(map((r) => r.data));
   */
  getConversations(): Observable<Conversation[]> {
    return of([]);
  }

  /**
   * Returns a single conversation with its participants.
   *
   * TODO: Replace stub with real HTTP call once backend is ready:
   *   return this.http
   *     .get<ApiResponse<Conversation>>(`${this.base}/${id}`)
   *     .pipe(map((r) => r.data));
   */
  getConversation(id: number): Observable<Conversation | null> {
    return of(null);
  }

  /**
   * Returns paginated messages for a conversation (newest-first from backend,
   * reversed for display).
   *
   * TODO: Replace stub with real HTTP call once backend is ready:
   *   return this.http
   *     .get<ApiResponse<Message[]>>(`${this.base}/${conversationId}/messages`)
   *     .pipe(map((r) => r.data));
   */
  getMessages(conversationId: number): Observable<Message[]> {
    return of([]);
  }

  /**
   * Sends a new message in an existing conversation.
   *
   * TODO: Replace stub with real HTTP call once backend is ready:
   *   return this.http
   *     .post<ApiResponse<Message>>(
   *       `${this.base}/${conversationId}/messages`,
   *       payload,
   *     )
   *     .pipe(map((r) => r.data));
   */
  sendMessage(
    conversationId: number,
    payload: { body: string },
  ): Observable<Message | null> {
    return of(null);
  }

  /**
   * Marks all unread messages in a conversation as read.
   *
   * TODO: Replace stub with real HTTP call once backend is ready:
   *   return this.http
   *     .patch<void>(`${this.base}/${conversationId}/read`, {});
   */
  markAsRead(conversationId: number): Observable<void> {
    return of(undefined);
  }
}
