<?php

namespace App\DTOs;

use Illuminate\Http\Request;

readonly class UpdateCommentDTO
{
    public function __construct(public string $content)
    {
    }

    public static function fromRequest(Request $request): self
    {
        return new self($request->string('content')->toString());
    }
}
