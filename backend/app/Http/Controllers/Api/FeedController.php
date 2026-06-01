<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\PostResource;
use App\Services\FeedService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedController extends ApiController
{
    public function __construct(private readonly FeedService $feed)
    {
    }

    public function global(Request $request): JsonResponse
    {
        return $this->success(PostResource::collection($this->feed->global($this->perPage($request))), 'Feed global carregado com sucesso');
    }

    public function following(Request $request): JsonResponse
    {
        return $this->success(
            PostResource::collection($this->feed->following($request->user()->id, $this->perPage($request))),
            'Feed de utilizadores seguidos carregado com sucesso'
        );
    }

    private function perPage(Request $request): int
    {
        return min(max((int) $request->integer('per_page', 15), 1), 50);
    }
}
