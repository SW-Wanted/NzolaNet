<?php

namespace App\Listeners;

use App\DTOs\NotificationDTO;
use App\Enums\NotificationType;
use App\Events\PostLiked;
use App\Services\NotificationService;

class CreateLikeNotification
{
    public function __construct(private readonly NotificationService $notifications)
    {
    }

    public function handle(PostLiked $event): void
    {
        $this->notifications->create(new NotificationDTO(
            recipientId: $event->recipientId,
            senderId: $event->senderId,
            type: NotificationType::Like,
            data: ['post_id' => $event->postId, 'message' => 'A sua publicacao recebeu um baze']
        ));
    }
}
