<?php

namespace App\Http\Controllers\Api;

use App\DTOs\CreateCommentDTO;
use App\DTOs\UpdateCommentDTO;
use App\Http\Requests\Comments\StoreCommentRequest;
use App\Http\Requests\Comments\UpdateCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Post;
use App\Services\CommentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends ApiController
{
    public function __construct(private readonly CommentService $comments)
    {
    }

    public function index(Request $request, Post $post): JsonResponse
    {
        return $this->success(
            CommentResource::collection($this->comments->forPost($post->id, $this->perPage($request))),
            'Comentarios listados com sucesso'
        );
    }

    public function store(StoreCommentRequest $request, Post $post): JsonResponse
    {
        return $this->success(
            new CommentResource($this->comments->create(CreateCommentDTO::fromRequest($request, $post->id))),
            'Comentario criado com sucesso',
            201
        );
    }

    public function update(UpdateCommentRequest $request, Comment $comment): JsonResponse
    {
        $this->authorize('update', $comment);

        return $this->success(
            new CommentResource($this->comments->update($comment, UpdateCommentDTO::fromRequest($request))),
            'Comentario atualizado com sucesso'
        );
    }

    public function destroy(Comment $comment): JsonResponse
    {
        $this->authorize('delete', $comment);
        $this->comments->delete($comment);

        return $this->noContent('Comentario excluido com sucesso');
    }

    private function perPage(Request $request): int
    {
        return min(max((int) $request->integer('per_page', 15), 1), 50);
    }
}
