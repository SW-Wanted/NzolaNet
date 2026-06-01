<?php

namespace App\DTOs;

use Illuminate\Http\Request;

readonly class CreateCommentDTO
{
    public function __construct(
        public int $userId,
        public int $postId,
        public string $content,
    ) {
    }

    public static function fromRequest(Request $request, int $postId): self
    {
        return new self(
            userId: $request->user()->id,
            postId: $postId,
            content: $request->string('content')->toString(),
        );
    }
}
