<?php

namespace App\DTOs;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

readonly class CreatePostDTO
{
    public function __construct(
        public int $userId,
        public string $content,
        public ?UploadedFile $image,
        public ?UploadedFile $video,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            userId: $request->user()->id,
            content: $request->string('content')->toString(),
            image: $request->file('image'),
            video: $request->file('video'),
        );
    }
}
