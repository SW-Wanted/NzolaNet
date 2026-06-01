<?php

namespace App\Repositories\Eloquent;

use App\DTOs\NotificationDTO;
use App\Models\Notification;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentNotificationRepository implements NotificationRepositoryInterface
{
    public function create(NotificationDTO $dto): Notification
    {
        return Notification::query()->create([
            'recipient_id' => $dto->recipientId,
            'sender_id' => $dto->senderId,
            'type' => $dto->type,
            'data' => $dto->data,
        ]);
    }

    public function forUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Notification::query()
            ->with(['sender'])
            ->where('recipient_id', $userId)
            ->latest()
            ->paginate($perPage);
    }

    public function findForUserOrFail(int $notificationId, int $userId): Notification
    {
        return Notification::query()
            ->where('recipient_id', $userId)
            ->findOrFail($notificationId);
    }

    public function markAsRead(Notification $notification): Notification
    {
        $notification->forceFill(['is_read' => true])->save();

        return $notification->refresh()->load(['sender']);
    }
}
