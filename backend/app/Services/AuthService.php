<?php

namespace App\Services;

use App\DTOs\RegisterUserDTO;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(private readonly UserRepositoryInterface $users)
    {
    }

    public function register(RegisterUserDTO $dto): array
    {
        $user = $this->users->create([
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => $dto->password,
        ]);

        return $this->tokenResponse($user);
    }

    public function login(string $email, string $password): array
    {
        $user = User::query()->where('email', Str::lower($email))->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais informadas sao invalidas.'],
            ]);
        }

        return $this->tokenResponse($user);
    }

    public function refresh(User $user): array
    {
        $user->currentAccessToken()?->delete();

        return $this->tokenResponse($user);
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    public function sendResetLink(string $email): string
    {
        return Password::sendResetLink(['email' => $email]);
    }

    public function resetPassword(array $credentials): string
    {
        return Password::reset($credentials, function (User $user, string $password): void {
            $user->forceFill([
                'password' => $password,
                'remember_token' => Str::random(60),
            ])->save();

            event(new PasswordReset($user));
        });
    }

    private function tokenResponse(User $user): array
    {
        return [
            'user' => $user->loadCount(['followers', 'following']),
            'token' => $user->createToken('nzolanet-api')->plainTextToken,
            'token_type' => 'Bearer',
        ];
    }
}
