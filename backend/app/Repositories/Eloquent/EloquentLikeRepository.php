<?php

namespace App\Repositories\Eloquent;

use App\Models\Like;
use App\Repositories\Contracts\LikeRepositoryInterface;

class EloquentLikeRepository implements LikeRepositoryInterface
{
    public function create(int $userId, int $postId): Like
    {
        return Like::query()->firstOrCreate([
            'user_id' => $userId,
            'post_id' => $postId,
        ]);
    }

    public function delete(int $userId, int $postId): bool
    {
        return Like::query()
            ->where('user_id', $userId)
            ->where('post_id', $postId)
            ->delete() > 0;
    }

    public function exists(int $userId, int $postId): bool
    {
        return Like::query()
            ->where('user_id', $userId)
            ->where('post_id', $postId)
            ->exists();
    }

    public function countForPost(int $postId): int
    {
        return Like::query()->where('post_id', $postId)->count();
    }
}
