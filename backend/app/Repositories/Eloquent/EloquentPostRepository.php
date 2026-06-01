<?php

namespace App\Repositories\Eloquent;

use App\Models\Post;
use App\Repositories\Contracts\PostRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentPostRepository implements PostRepositoryInterface
{
    public function create(array $data): Post
    {
        return Post::query()->create($data)->load(['user'])->loadCount(['likes', 'comments']);
    }

    public function findOrFail(int $id): Post
    {
        return Post::query()
            ->with(['user'])
            ->withCount(['likes', 'comments'])
            ->findOrFail($id);
    }

    public function update(Post $post, array $data): Post
    {
        $post->fill($data)->save();

        return $post->refresh()->load(['user'])->loadCount(['likes', 'comments']);
    }

    public function delete(Post $post): bool
    {
        return (bool) $post->delete();
    }

    public function recent(int $perPage = 15): LengthAwarePaginator
    {
        return Post::query()
            ->with(['user'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate($perPage);
    }

    public function fromUsers(Collection $userIds, int $perPage = 15): LengthAwarePaginator
    {
        return Post::query()
            ->with(['user'])
            ->withCount(['likes', 'comments'])
            ->whereIn('user_id', $userIds)
            ->latest()
            ->paginate($perPage);
    }
}
