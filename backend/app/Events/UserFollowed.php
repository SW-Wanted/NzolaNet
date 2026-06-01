<?php

namespace App\Events;

class UserFollowed
{
    public function __construct(
        public readonly int $followerId,
        public readonly int $followingId,
    ) {
    }
}
