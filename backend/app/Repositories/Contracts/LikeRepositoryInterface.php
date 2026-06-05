<?php

namespace App\Repositories\Contracts;

use App\Models\Like;
use Illuminate\Support\Collection;

interface LikeRepositoryInterface
{
    public function create(int $userId, int $postId): Like;

    public function delete(int $userId, int $postId): bool;

    public function exists(int $userId, int $postId): bool;

    public function countForPost(int $postId): int;

    public function usersForPost(int $postId): Collection;
}
