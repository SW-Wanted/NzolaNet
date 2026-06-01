<?php

namespace App\Http\Controllers\Api;

use App\DTOs\FollowUserDTO;
use App\DTOs\UpdateUserDTO;
use App\Http\Requests\Users\ProfilePhotoRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends ApiController
{
    public function __construct(private readonly UserService $users)
    {
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return $this->success(new UserResource($this->users->profile($request->user(), $id)), 'Perfil obtido com sucesso');
    }

    public function updateProfile(UpdateUserRequest $request): JsonResponse
    {
        return $this->success(
            new UserResource($this->users->updateProfile($request->user(), UpdateUserDTO::fromRequest($request))),
            'Perfil atualizado com sucesso'
        );
    }

    public function updateProfilePhoto(ProfilePhotoRequest $request): JsonResponse
    {
        return $this->success(
            new UserResource($this->users->updateProfilePhoto($request->user(), $request->file('photo'))),
            'Foto de perfil atualizada com sucesso'
        );
    }

    public function follow(Request $request, int $id): JsonResponse
    {
        $this->users->follow(new FollowUserDTO($request->user()->id, $id));

        return $this->noContent('Utilizador seguido com sucesso');
    }

    public function unfollow(Request $request, int $id): JsonResponse
    {
        $this->users->unfollow(new FollowUserDTO($request->user()->id, $id));

        return $this->noContent('Utilizador deixou de ser seguido com sucesso');
    }

    public function followers(Request $request, User $user): JsonResponse
    {
        return $this->success(
            UserResource::collection($this->users->followers($user, $this->perPage($request))),
            'Seguidores listados com sucesso'
        );
    }

    public function following(Request $request, User $user): JsonResponse
    {
        return $this->success(
            UserResource::collection($this->users->following($user, $this->perPage($request))),
            'Utilizadores seguidos listados com sucesso'
        );
    }

    private function perPage(Request $request): int
    {
        return min(max((int) $request->integer('per_page', 15), 1), 50);
    }
}
