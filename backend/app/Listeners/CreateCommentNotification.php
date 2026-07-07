<?php

namespace App\Listeners;

use App\DTOs\NotificationDTO;
use App\Enums\NotificationType;
use App\Events\CommentCreated;
use App\Services\NotificationService;

class CreateCommentNotification
{
    public function __construct(private readonly NotificationService $notifications)
    {
    }

    public function handle(CommentCreated $event): void
    {
        $this->notifications->create(new NotificationDTO(
            recipientId: $event->recipientId,
            senderId: $event->senderId,
            type: NotificationType::Comment,
            data: ['comment_id' => $event->commentId, 'post_id' => $event->postId, 'message' => 'A sua publicacao recebeu um comentario']
        ));
    }
}
