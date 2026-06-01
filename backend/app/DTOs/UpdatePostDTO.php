<?php

namespace App\DTOs;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

readonly class UpdatePostDTO
{
    public function __construct(
        public ?string $content,
        public ?UploadedFile $image,
        public ?UploadedFile $video,
        public bool $removeImage,
        public bool $removeVideo,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            content: $request->has('content') ? $request->string('content')->toString() : null,
            image: $request->file('image'),
            video: $request->file('video'),
            removeImage: $request->boolean('remove_image'),
            removeVideo: $request->boolean('remove_video'),
        );
    }
}
