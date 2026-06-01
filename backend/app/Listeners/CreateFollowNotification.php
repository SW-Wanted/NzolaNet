<?php

namespace App\Listeners;

use App\DTOs\NotificationDTO;
use App\Enums\NotificationType;
use App\Events\UserFollowed;
use App\Services\NotificationService;

class CreateFollowNotification
{
    public function __construct(private readonly NotificationService $notifications)
    {
    }

    public function handle(UserFollowed $event): void
    {
        $this->notifications->create(new NotificationDTO(
            recipientId: $event->followingId,
            senderId: $event->followerId,
            type: NotificationType::Follow,
            data: ['message' => 'Novo seguidor na NzolaNet']
        ));
    }
}
