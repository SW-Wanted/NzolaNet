<?php

namespace App\Http\Controllers\Api;

use App\DTOs\CreatePostDTO;
use App\DTOs\UpdatePostDTO;
use App\Http\Requests\Posts\StorePostRequest;
use App\Http\Requests\Posts\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends ApiController
{
    public function __construct(private readonly PostService $posts)
    {
    }

    public function index(Request $request): JsonResponse
    {
        return $this->success(PostResource::collection($this->posts->list($this->perPage($request))), 'Publicacoes listadas com sucesso');
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        return $this->success(
            new PostResource($this->posts->create(CreatePostDTO::fromRequest($request))),
            'Publicacao criada com sucesso',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(new PostResource($this->posts->get($id)), 'Publicacao obtida com sucesso');
    }

    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        $this->authorize('update', $post);

        return $this->success(
            new PostResource($this->posts->update($post, UpdatePostDTO::fromRequest($request))),
            'Publicacao atualizada com sucesso'
        );
    }

    public function destroy(Post $post): JsonResponse
    {
        $this->authorize('delete', $post);
        $this->posts->delete($post);

        return $this->noContent('Publicacao excluida com sucesso');
    }

    private function perPage(Request $request): int
    {
        return min(max((int) $request->integer('per_page', 15), 1), 50);
    }
}
