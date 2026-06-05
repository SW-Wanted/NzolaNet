<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface UserRepositoryInterface
{
    public function create(array $data): User;

    public function find(int $id): ?User;

    public function findOrFail(int $id): User;

    public function listExcept(int $userId, int $perPage = 20): LengthAwarePaginator;

    public function update(User $user, array $data): User;

    public function follow(int $followerId, int $followingId): void;

    public function unfollow(int $followerId, int $followingId): void;

    public function isFollowing(int $followerId, int $followingId): bool;

    public function followers(User $user, int $perPage = 15): LengthAwarePaginator;

    public function following(User $user, int $perPage = 15): LengthAwarePaginator;

    public function followingIds(int $userId): Collection;
}
