<?php

namespace App\Repositories\Eloquent;

use App\Models\Like;
use App\Repositories\Contracts\LikeRepositoryInterface;
use Illuminate\Support\Collection;

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

    public function usersForPost(int $postId): Collection
    {
        return Like::query()
            ->where('post_id', $postId)
            ->with(['user' => fn ($query) => $query->withCount(['followers', 'following', 'posts'])])
            ->latest()
            ->get()
            ->pluck('user')
            ->filter()
            ->values();
    }
}
