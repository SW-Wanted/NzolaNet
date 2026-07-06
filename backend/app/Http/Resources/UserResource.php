<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->when($request->user()?->id === $this->id || $request->user()?->isAdmin(), $this->email),
            'profile_photo' => $this->profile_photo,
            'profile_photo_url' => $this->profile_photo ? Storage::disk('public')->url($this->profile_photo) : null,
            'bio' => $this->bio,
            'is_private' => $this->is_private,
            'role' => $this->role?->value ?? $this->role,
            'followers_count' => $this->whenCounted('followers'),
            'following_count' => $this->whenCounted('following'),
            'posts_count' => $this->whenCounted('posts'),
            'is_following' => $request->user() && $request->user()->id !== $this->id
                ? $request->user()->following()->whereKey($this->id)->exists()
                : false,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
