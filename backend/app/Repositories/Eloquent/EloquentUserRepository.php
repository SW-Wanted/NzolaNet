<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentUserRepository implements UserRepositoryInterface
{
    public function create(array $data): User
    {
        return User::query()->create($data);
    }

    public function find(int $id): ?User
    {
        return User::query()->find($id);
    }

    public function findOrFail(int $id): User
    {
        return User::query()
            ->withCount(['followers', 'following'])
            ->findOrFail($id);
    }

    public function listExcept(int $userId, int $perPage = 20): LengthAwarePaginator
    {
        return User::query()
            ->whereKeyNot($userId)
            ->withCount(['followers', 'following'])
            ->latest()
            ->paginate($perPage);
    }

    public function update(User $user, array $data): User
    {
        $user->fill($data)->save();

        return $user->refresh()->loadCount(['followers', 'following']);
    }

    public function follow(int $followerId, int $followingId): void
    {
        User::query()->findOrFail($followerId)->following()->syncWithoutDetaching([$followingId]);
    }

    public function unfollow(int $followerId, int $followingId): void
    {
        User::query()->findOrFail($followerId)->following()->detach($followingId);
    }

    public function isFollowing(int $followerId, int $followingId): bool
    {
        return User::query()
            ->whereKey($followerId)
            ->whereHas('following', fn ($query) => $query->whereKey($followingId))
            ->exists();
    }

    public function followers(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return $user->followers()->withCount(['followers', 'following'])->latest('followers.created_at')->paginate($perPage);
    }

    public function following(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return $user->following()->withCount(['followers', 'following'])->latest('followers.created_at')->paginate($perPage);
    }

    public function followingIds(int $userId): Collection
    {
        return User::query()->findOrFail($userId)->following()->pluck('users.id');
    }
}
