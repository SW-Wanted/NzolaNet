<?php

namespace App\Repositories\Contracts;

use App\Models\Comment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CommentRepositoryInterface
{
    public function create(array $data): Comment;

    public function findOrFail(int $id): Comment;

    public function update(Comment $comment, array $data): Comment;

    public function delete(Comment $comment): bool;

    public function forPost(int $postId, int $perPage = 15): LengthAwarePaginator;
}
