<?php

namespace App\Repositories\Contracts;

use App\Models\Post;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface PostRepositoryInterface
{
    public function create(array $data): Post;

    public function findOrFail(int $id): Post;

    public function update(Post $post, array $data): Post;

    public function delete(Post $post): bool;

    public function recent(int $perPage = 15): LengthAwarePaginator;

    public function fromUsers(Collection $userIds, int $perPage = 15): LengthAwarePaginator;
}
