<?php

namespace App\Http\Controllers\Api;

use App\DTOs\RegisterUserDTO;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends ApiController
{
    public function __construct(private readonly AuthService $auth)
    {
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        return $this->authPayload($this->auth->register(RegisterUserDTO::fromRequest($request)), 'Utilizador registado com sucesso', 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        return $this->authPayload(
            $this->auth->login($request->string('email')->toString(), $request->string('password')->toString()),
            'Login realizado com sucesso'
        );
    }

    public function me(Request $request): JsonResponse
    {
        return $this->success(new UserResource($request->user()->loadCount(['followers', 'following'])), 'Utilizador autenticado');
    }

    public function refresh(Request $request): JsonResponse
    {
        return $this->authPayload($this->auth->refresh($request->user()), 'Token atualizado com sucesso');
    }

    public function logout(Request $request): JsonResponse
    {
        $this->auth->logout($request->user());

        return $this->noContent('Logout realizado com sucesso');
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $status = $this->auth->sendResetLink($request->string('email')->toString());

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages(['email' => [__($status)]]);
        }

        return $this->noContent('Link de recuperacao enviado com sucesso');
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = $this->auth->resetPassword($request->validated());

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages(['email' => [__($status)]]);
        }

        return $this->noContent('Senha redefinida com sucesso');
    }

    private function authPayload(array $payload, string $message, int $status = 200): JsonResponse
    {
        $user = $payload['user'];

        return $this->success([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role?->value ?? $user->role,
                'is_private' => $user->is_private,
                'profile_photo' => $user->profile_photo,
                'profile_photo_url' => $user->profile_photo
                    ? \Illuminate\Support\Facades\Storage::disk('public')->url($user->profile_photo)
                    : null,
                'bio' => $user->bio,
            ],
            'access_token' => $payload['token'],
            'token_type' => $payload['token_type'],
        ], $message, $status);
    }
}
