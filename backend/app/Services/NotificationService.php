<?php

namespace App\Services;

use App\DTOs\NotificationDTO;
use App\Models\Notification;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NotificationService
{
    public function __construct(private readonly NotificationRepositoryInterface $notifications)
    {
    }

    public function create(NotificationDTO $dto): Notification
    {
        return $this->notifications->create($dto);
    }

    public function forUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->notifications->forUser($userId, $perPage);
    }

    public function markAsRead(int $notificationId, int $userId): Notification
    {
        return $this->notifications->markAsRead(
            $this->notifications->findForUserOrFail($notificationId, $userId)
        );
    }
}
