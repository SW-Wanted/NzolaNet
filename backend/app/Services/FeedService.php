<?php

namespace App\Services;

use App\Repositories\Contracts\PostRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class FeedService
{
    public function __construct(
        private readonly PostRepositoryInterface $posts,
        private readonly UserRepositoryInterface $users,
    ) {
    }

    public function global(int $viewerId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->posts->recentVisibleTo($viewerId, $perPage);
    }

    public function following(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->posts->fromUsers($this->users->followingIds($userId), $perPage);
    }
}
