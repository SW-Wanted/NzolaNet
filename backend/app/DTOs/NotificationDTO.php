<?php

namespace App\DTOs;

use App\Enums\NotificationType;

readonly class NotificationDTO
{
    public function __construct(
        public int $recipientId,
        public ?int $senderId,
        public NotificationType $type,
        public array $data = [],
    ) {
    }
}
