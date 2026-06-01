<?php

namespace App\Http\Controllers\Api;

use App\Models\Post;
use App\Services\LikeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LikeController extends ApiController
{
    public function __construct(private readonly LikeService $likes)
    {
    }

    public function store(Request $request, Post $post): JsonResponse
    {
        return $this->success([
            'likes_count' => $this->likes->like($request->user()->id, $post),
        ], 'Baze adicionada com sucesso', 201);
    }

    public function destroy(Request $request, Post $post): JsonResponse
    {
        return $this->success([
            'likes_count' => $this->likes->unlike($request->user()->id, $post),
        ], 'Baze removida com sucesso');
    }
}
