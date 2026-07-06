<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Services\CommentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModerationController extends ApiController
{
    public function __construct(private readonly CommentService $comments)
    {
    }

    public function comments(Request $request): JsonResponse
    {
        return $this->success(
            CommentResource::collection($this->comments->latest($this->perPage($request))),
            'Comentarios listados para moderacao'
        );
    }

    public function destroyComment(Comment $comment): JsonResponse
    {
        $this->comments->delete($comment);

        return $this->noContent('Comentario removido pela moderacao');
    }

    private function perPage(Request $request): int
    {
        return min(max((int) $request->integer('per_page', 15), 1), 50);
    }
}
