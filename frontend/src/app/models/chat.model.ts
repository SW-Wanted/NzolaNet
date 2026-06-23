// ─────────────────────────────────────────────────────────────
// Chat domain models
// These interfaces mirror the backend schema that will be built.
// TODO: Verify field names against the backend JSON responses once
//       the chat API is implemented (see CHAT_BACKEND_REQUIREMENTS.md).
// ─────────────────────────────────────────────────────────────

/** Delivery / read state of an individual message. */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

/** Slim user representation returned inside conversation payloads. */
export interface ChatParticipant {
  id: number;
  name: string;
  email: string;
  profile_photo: string | null;
}

/** A single chat message as returned by GET /api/conversations/{id}/messages */
export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  body: string;
  status: MessageStatus;
  created_at: string; // ISO 8601
  updated_at: string;
  sender?: ChatParticipant;
}

/** Unread-message counter per conversation. */
export interface UnreadCounter {
  conversation_id: number;
  count: number;
}

/** A conversation thread as returned by GET /api/conversations */
export interface Conversation {
  id: number;
  participants: ChatParticipant[];
  last_message: Message | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}
