<?php

namespace App\Repositories\Eloquent;

use App\Models\Comment;
use App\Repositories\Contracts\CommentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentCommentRepository implements CommentRepositoryInterface
{
    public function create(array $data): Comment
    {
        return Comment::query()->create($data)->load(['user', 'post.user']);
    }

    public function findOrFail(int $id): Comment
    {
        return Comment::query()->with(['user', 'post.user'])->findOrFail($id);
    }

    public function update(Comment $comment, array $data): Comment
    {
        $comment->fill($data)->save();

        return $comment->refresh()->load(['user', 'post.user']);
    }

    public function delete(Comment $comment): bool
    {
        return (bool) $comment->delete();
    }

    public function forPost(int $postId, int $perPage = 15): LengthAwarePaginator
    {
        return Comment::query()
            ->with(['user'])
            ->where('post_id', $postId)
            ->latest()
            ->paginate($perPage);
    }
}
