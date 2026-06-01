<?php

namespace App\Repositories\Contracts;

use App\DTOs\NotificationDTO;
use App\Models\Notification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface NotificationRepositoryInterface
{
    public function create(NotificationDTO $dto): Notification;

    public function forUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    public function findForUserOrFail(int $notificationId, int $userId): Notification;

    public function markAsRead(Notification $notification): Notification;
}
