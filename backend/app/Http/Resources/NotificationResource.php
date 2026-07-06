<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'recipient_id' => $this->recipient_id,
            'sender' => $this->when(
                $this->relationLoaded('sender') && $this->sender,
                fn () => new UserResource($this->sender),
                null
            ),
            'type' => $this->type?->value ?? $this->type,
            'data' => $this->data,
            'is_read' => $this->is_read,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
