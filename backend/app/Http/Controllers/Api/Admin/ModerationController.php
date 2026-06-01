<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Comment;
use App\Services\CommentService;
use Illuminate\Http\JsonResponse;

class ModerationController extends ApiController
{
    public function __construct(private readonly CommentService $comments)
    {
    }

    public function destroyComment(Comment $comment): JsonResponse
    {
        $this->comments->delete($comment);

        return $this->noContent('Comentario removido pela moderacao');
    }
}
