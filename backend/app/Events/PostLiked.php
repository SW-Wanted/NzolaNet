<?php

namespace App\Events;

class PostLiked
{
    public function __construct(
        public readonly int $senderId,
        public readonly int $postId,
        public readonly int $recipientId,
    ) {
    }
}
