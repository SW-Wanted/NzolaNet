<?php

namespace App\Http\Resources;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $target = $this->reportable;
        $author = $target?->user;

        return [
            'id' => $this->id,
            'type' => $target instanceof Post ? 'publicacao' : 'comentario',
            'tipoAlvo' => $target instanceof Post ? 'publicacao' : 'comentario',
            'reason' => $this->reason,
            'motivo' => $this->reason,
            'description' => $this->description,
            'descricao' => $this->description,
            'status' => $this->status,
            'estado' => $this->status,
            'reporter' => new UserResource($this->whenLoaded('reporter')),
            'denunciante' => $this->reporter?->name,
            'denuncianteAvatar' => $this->reporter?->profile_photo
                ? Storage::disk('public')->url($this->reporter->profile_photo)
                : null,
            'content_author' => $author ? new UserResource($author) : null,
            'autorConteudoId' => $author?->id,
            'autorConteudo' => $author?->name,
            'autorConteudoAvatar' => $author?->profile_photo
                ? Storage::disk('public')->url($author->profile_photo)
                : null,
            'content' => $target?->content,
            'conteudo' => $target?->content,
            'image_url' => $target instanceof Post && $target->image_path
                ? Storage::disk('public')->url($target->image_path)
                : null,
            'imagemConteudo' => $target instanceof Post && $target->image_path
                ? Storage::disk('public')->url($target->image_path)
                : null,
            'video_url' => $target instanceof Post && $target->video_path
                ? Storage::disk('public')->url($target->video_path)
                : null,
            'post_id' => $target instanceof Post ? $target->id : ($target instanceof Comment ? $target->post_id : null),
            'comment_id' => $target instanceof Comment ? $target->id : null,
            'resolved_by' => $this->whenLoaded('resolver', fn () => $this->resolver ? new UserResource($this->resolver) : null),
            'resolved_at' => $this->resolved_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'data' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
