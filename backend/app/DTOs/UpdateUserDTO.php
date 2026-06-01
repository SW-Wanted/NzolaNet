<?php

namespace App\DTOs;

use Illuminate\Http\Request;

readonly class UpdateUserDTO
{
    public function __construct(
        public ?string $name,
        public ?string $bio,
        public ?bool $isPrivate,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            name: $request->has('name') ? $request->string('name')->toString() : null,
            bio: $request->has('bio') ? $request->string('bio')->toString() : null,
            isPrivate: $request->has('is_private') ? $request->boolean('is_private') : null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'name' => $this->name,
            'bio' => $this->bio,
            'is_private' => $this->isPrivate,
        ], static fn (mixed $value): bool => $value !== null);
    }
}
