# Chat Backend Requirements

**Document type:** Technical specification for backend implementation  
**Frontend status:** UI ready — all integration points are stubbed with TODO comments  
**Backend status:** No chat infrastructure exists  
**Audit date:** 2026-06-23

---

## 1. Database Tables

### `conversations`

| Column | Type | Notes |
|---|---|---|
| `id` | `BIGINT UNSIGNED` PK | Auto-increment |
| `created_at` | `TIMESTAMP` | |
| `updated_at` | `TIMESTAMP` | |

### `conversation_participants`

| Column | Type | Notes |
|---|---|---|
| `id` | `BIGINT UNSIGNED` PK | Auto-increment |
| `conversation_id` | `BIGINT UNSIGNED` FK | → `conversations.id` |
| `user_id` | `BIGINT UNSIGNED` FK | → `users.id` |
| `last_read_at` | `TIMESTAMP` nullable | For unread-count calculation |
| `created_at` | `TIMESTAMP` | |
| `updated_at` | `TIMESTAMP` | |

Add unique index on `(conversation_id, user_id)` to prevent duplicate participants.

### `messages`

| Column | Type | Notes |
|---|---|---|
| `id` | `BIGINT UNSIGNED` PK | Auto-increment |
| `conversation_id` | `BIGINT UNSIGNED` FK | → `conversations.id` |
| `sender_id` | `BIGINT UNSIGNED` FK | → `users.id` |
| `body` | `TEXT` | Message content |
| `status` | `ENUM('sent','delivered','read')` | Default `sent` |
| `created_at` | `TIMESTAMP` | |
| `updated_at` | `TIMESTAMP` | |

Add index on `(conversation_id, created_at)` for efficient message pagination.

---

## 2. Eloquent Models Required

### `Conversation`

```php
// app/Models/Conversation.php
class Conversation extends Model
{
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'conversation_participants')
                    ->withPivot('last_read_at')
                    ->withTimestamps();
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->latest();
    }

    public function lastMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    public function unreadCountFor(User $user): int
    {
        $pivot = $this->participants()->where('user_id', $user->id)->first()?->pivot;
        $since = $pivot?->last_read_at ?? $pivot?->created_at;
        return $this->messages()
                    ->where('sender_id', '!=', $user->id)
                    ->when($since, fn($q) => $q->where('created_at', '>', $since))
                    ->count();
    }
}
```

### `Message`

```php
// app/Models/Message.php
class Message extends Model
{
    protected $casts = [
        'status' => MessageStatus::class,
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
```

### `MessageStatus` enum

```php
// app/Enums/MessageStatus.php
enum MessageStatus: string
{
    case Sent      = 'sent';
    case Delivered = 'delivered';
    case Read      = 'read';
}
```

Add to `User` model:

```php
public function conversations(): BelongsToMany
{
    return $this->belongsToMany(Conversation::class, 'conversation_participants')
                ->withPivot('last_read_at')
                ->withTimestamps();
}
```

---

## 3. Controllers Required

### `ConversationController`

```
app/Http/Controllers/ConversationController.php
```

| Method | Signature | Description |
|---|---|---|
| `index` | `GET /api/conversations` | Returns conversations for the authenticated user, with last message and unread count |
| `store` | `POST /api/conversations` | Creates a new conversation between two users (or returns existing) |
| `show` | `GET /api/conversations/{conversation}` | Returns a single conversation with participants |
| `markAsRead` | `PATCH /api/conversations/{conversation}/read` | Updates `last_read_at` for the current user |

### `MessageController`

```
app/Http/Controllers/MessageController.php
```

| Method | Signature | Description |
|---|---|---|
| `index` | `GET /api/conversations/{conversation}/messages` | Returns paginated messages, newest first |
| `store` | `POST /api/conversations/{conversation}/messages` | Creates a new message and fires `MessageSent` event |

---

## 4. API Routes Required

Add to `routes/api.php` inside the `auth:sanctum` middleware group:

```php
Route::prefix('conversations')->group(function () {
    Route::get('/',                                  [ConversationController::class, 'index']);
    Route::post('/',                                 [ConversationController::class, 'store']);
    Route::get('/{conversation}',                    [ConversationController::class, 'show']);
    Route::patch('/{conversation}/read',             [ConversationController::class, 'markAsRead']);
    Route::get('/{conversation}/messages',           [MessageController::class, 'index']);
    Route::post('/{conversation}/messages',          [MessageController::class, 'store']);
});
```

Apply `ConversationParticipantPolicy` to all routes to ensure only participants can read/write.

---

## 5. WebSocket Support Options

### Option A — Laravel Reverb (Recommended)

Reverb is Laravel's first-party WebSocket server. No external dependency or paid plan needed.

**Installation:**
```bash
composer require laravel/reverb
php artisan reverb:install
```

**`.env` additions:**
```
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=nzolanet
REVERB_APP_KEY=your-key
REVERB_APP_SECRET=your-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

**Start server:**
```bash
php artisan reverb:start
```

**Frontend** — install `laravel-echo` and `pusher-js`:
```bash
npm install laravel-echo pusher-js
```

### Option B — Pusher

Hosted WebSocket service. Requires a paid account for production.

**Installation:**
```bash
composer require pusher/pusher-php-server
```

**`.env` additions:**
```
BROADCAST_CONNECTION=pusher
PUSHER_APP_ID=your-app-id
PUSHER_APP_KEY=your-key
PUSHER_APP_SECRET=your-secret
PUSHER_APP_CLUSTER=eu
```

**Frontend:**
```bash
npm install laravel-echo pusher-js
```

### Option C — Polling (no WebSocket, minimal backend change)

If real-time delivery is not required immediately, the frontend `ChatService` can poll `GET /api/conversations/{id}/messages` every 5 seconds. The service is already designed for this — replace `of([])` with the real HTTP call and the polling interval does the rest.

---

## 6. Events Required

### `MessageSent`

```php
// app/Events/MessageSent.php
class MessageSent implements ShouldBroadcast
{
    public function __construct(public Message $message) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("conversation.{$this->message->conversation_id}"),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'id'              => $this->message->id,
            'conversation_id' => $this->message->conversation_id,
            'sender_id'       => $this->message->sender_id,
            'body'            => $this->message->body,
            'status'          => $this->message->status,
            'created_at'      => $this->message->created_at->toIso8601String(),
            'sender'          => [
                'id'            => $this->message->sender->id,
                'name'          => $this->message->sender->name,
                'profile_photo' => $this->message->sender->profile_photo,
            ],
        ];
    }
}
```

### `MessageRead`

```php
// app/Events/MessageRead.php
class MessageRead implements ShouldBroadcast
{
    public function __construct(
        public int $conversationId,
        public int $readerId,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel("conversation.{$this->conversationId}")];
    }
}
```

### `ConversationCreated`

```php
// app/Events/ConversationCreated.php
class ConversationCreated implements ShouldBroadcast
{
    public function __construct(public Conversation $conversation) {}

    public function broadcastOn(): array
    {
        return $this->conversation->participants
            ->map(fn($u) => new PrivateChannel("user.{$u->id}"))
            ->all();
    }
}
```

### Channel authorization (`routes/channels.php`)

```php
Broadcast::channel('conversation.{conversationId}', function (User $user, int $conversationId) {
    return $user->conversations()->where('conversations.id', $conversationId)->exists();
});

Broadcast::channel('user.{userId}', function (User $user, int $userId) {
    return $user->id === $userId;
});
```

---

## 7. Frontend Integration Points

All integration points are already marked with `// TODO` comments in the frontend source. No structural changes are needed — only uncommenting and wiring.

### `frontend/src/app/services/chat.service.ts`

| Method | TODO location | Action required |
|---|---|---|
| `getConversations()` | Line ~35 | Replace `of([])` with `this.http.get(this.base)` |
| `getConversation(id)` | Line ~47 | Replace `of(null)` with `this.http.get(...)` |
| `getMessages(conversationId)` | Line ~59 | Replace `of([])` with `this.http.get(...)` |
| `sendMessage(conversationId, payload)` | Line ~71 | Replace `of(null)` with `this.http.post(...)` |
| `markAsRead(conversationId)` | Line ~83 | Replace `of(undefined)` with `this.http.patch(...)` |
| Constructor | Top | Inject `HttpClient` |
| `base` constant | Top | Set to `${API_URL}/conversations` |

### `frontend/src/app/pages/chat/chat.component.ts`

| Method | TODO location | Action required |
|---|---|---|
| `ngOnInit()` | Comment at top | Replace `userService.getUsers()` with `chatService.getConversations()` |
| `abrirConversa()` | Line ~77 | Use real `conversation.id` instead of `user.id` |
| `abrirConversa()` | After getMessages | Uncomment `markAsRead()` call |
| `enviarMensagem()` | Commented block | Uncomment full HTTP send logic |
| `aoTeclaEnter()` | Comment | Uncomment `enviarMensagem()` call |

### Input area — enable sending

In `chat.component.html`, remove these two attributes when backend is ready:
- `disabled` on the `<input>`
- `[disabled]="true"` on the send `<button>`
- Remove class `chat-input-area--desactivado` from the wrapper

### Real-time — Angular Echo setup

Add to `app.config.ts` when Reverb/Pusher is configured:

```typescript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as any).Pusher = Pusher;

export const echo = new Echo({
  broadcaster: 'reverb',                      // or 'pusher'
  key: environment.reverbAppKey,
  wsHost: environment.reverbHost,
  wsPort: environment.reverbPort,
  forceTLS: false,
  enabledTransports: ['ws', 'wss'],
  authEndpoint: `${API_URL}/broadcasting/auth`,
});
```

Subscribe to the conversation channel in `abrirConversa()`:

```typescript
echo.private(`conversation.${conversationId}`)
    .listen('MessageSent', (e: { message: Message }) => {
        this.mensagens.update((list) => [...list, e.message]);
        setTimeout(() => this.scrollParaFim(), 50);
    });
```

---

## 8. Sequence Diagrams

### 8.1 — Opening a conversation (polling mode)

```
Browser                  Angular                  Laravel API
  │                         │                          │
  │  click contact          │                          │
  │────────────────────────▶│                          │
  │                         │  GET /conversations      │
  │                         │─────────────────────────▶│
  │                         │  [{ id, last_message }]  │
  │                         │◀─────────────────────────│
  │                         │  GET /conversations/7/messages │
  │                         │─────────────────────────▶│
  │                         │  [{ id, body, sender }]  │
  │                         │◀─────────────────────────│
  │  render messages        │                          │
  │◀────────────────────────│                          │
  │                         │  PATCH /conversations/7/read │
  │                         │─────────────────────────▶│
  │                         │  204 No Content          │
  │                         │◀─────────────────────────│
```

### 8.2 — Sending a message (polling mode)

```
Browser                  Angular                  Laravel API
  │                         │                          │
  │  press Enter / Send     │                          │
  │────────────────────────▶│                          │
  │                         │  POST /conversations/7/messages │
  │                         │  { body: "Olá!" }        │
  │                         │─────────────────────────▶│
  │                         │  { id, body, status: sent } │
  │                         │◀─────────────────────────│
  │  append bubble          │                          │
  │◀────────────────────────│                          │
```

### 8.3 — Real-time delivery (WebSocket mode)

```
Sender Browser        Angular (A)          Reverb           Angular (B)       Receiver Browser
      │                    │                  │                   │                    │
      │  Send message      │                  │                   │                    │
      │───────────────────▶│                  │                   │                    │
      │                    │  POST /messages  │                   │                    │
      │                    │─────────────────▶│ (HTTP)            │                    │
      │                    │  { message }     │                   │                    │
      │                    │◀─────────────────│                   │                    │
      │  append bubble (A) │                  │                   │                    │
      │◀───────────────────│                  │  MessageSent event│                    │
      │                    │                  │──────────────────▶│                    │
      │                    │                  │                   │  append bubble (B) │
      │                    │                  │                   │───────────────────▶│
```

### 8.4 — Conversation creation

```
Browser                  Angular                  Laravel API
  │                         │                          │
  │  open chat with user 5  │                          │
  │────────────────────────▶│                          │
  │                         │  POST /conversations     │
  │                         │  { participant_id: 5 }   │
  │                         │─────────────────────────▶│
  │                         │  (existing or new conv.) │
  │                         │  { id: 12, participants }│
  │                         │◀─────────────────────────│
  │                         │  GET /conversations/12/messages │
  │                         │─────────────────────────▶│
  │                         │  []  (new conversation)  │
  │                         │◀─────────────────────────│
  │  show empty chat panel  │                          │
  │◀────────────────────────│                          │
```

---

## Summary

| Item | Status |
|---|---|
| Frontend models (`Conversation`, `Message`, `ChatParticipant`, `MessageStatus`, `UnreadCounter`) | ✅ Created |
| `ChatService` with stubbed methods + TODO comments | ✅ Created |
| Chat UI (layout, bubbles, input, loading, empty states) | ✅ Preserved |
| Send disabled + honest notice | ✅ Applied |
| Database migrations | ❌ Backend task |
| Eloquent models | ❌ Backend task |
| API routes & controllers | ❌ Backend task |
| WebSocket server (Reverb/Pusher) | ❌ Backend task |
| Broadcast events | ❌ Backend task |
