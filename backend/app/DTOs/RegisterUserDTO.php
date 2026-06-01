<?php

namespace App\DTOs;

use Illuminate\Http\Request;

readonly class RegisterUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            name: $request->string('name')->toString(),
            email: $request->string('email')->lower()->toString(),
            password: $request->string('password')->toString(),
        );
    }
}
