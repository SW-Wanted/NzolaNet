<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'author' => new UserResource($this->whenLoaded('user')),
            'author_name' => $this->user?->name,
            'author_photo' => $this->user?->profile_photo,
            'published_at' => $this->created_at?->toISOString(),
            'content' => $this->content,
            'image' => $this->image_path ? Storage::disk('public')->url($this->image_path) : null,
            'image_path' => $this->image_path,
            'image_url' => $this->image_path ? Storage::disk('public')->url($this->image_path) : null,
            'video' => $this->video_path ? Storage::disk('public')->url($this->video_path) : null,
            'video_path' => $this->video_path,
            'video_url' => $this->video_path ? Storage::disk('public')->url($this->video_path) : null,
            'likes_count' => $this->whenCounted('likes'),
            'comments_count' => $this->whenCounted('comments'),
            'liked_by_me' => $request->user()
                ? $this->likes()->where('user_id', $request->user()->id)->exists()
                : false,
            'can_update' => $request->user()?->can('update', $this->resource) ?? false,
            'can_delete' => $request->user()?->can('delete', $this->resource) ?? false,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
