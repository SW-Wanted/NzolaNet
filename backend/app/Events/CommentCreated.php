<?php

namespace App\Events;

class CommentCreated
{
    public function __construct(
        public readonly int $commentId,
        public readonly int $postId,
        public readonly int $senderId,
        public readonly int $recipientId,
    ) {
    }
}
