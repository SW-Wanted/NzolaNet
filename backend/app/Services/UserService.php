<?php

namespace App\Services;

use App\DTOs\FollowUserDTO;
use App\DTOs\UpdateUserDTO;
use App\Events\UserFollowed;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class UserService
{
    public function __construct(private readonly UserRepositoryInterface $users)
    {
    }

    public function profile(User $viewer, int $id): User
    {
        $profile = $this->users->findOrFail($id);

        if ($profile->is_private && $viewer->isNot($profile) && ! $viewer->isAdmin() && ! $this->users->isFollowing($viewer->id, $profile->id)) {
            throw new AuthorizationException('Este perfil e privado.');
        }

        return $profile;
    }

    public function suggestions(User $viewer, int $perPage = 20): LengthAwarePaginator
    {
        return $this->users->listExcept($viewer->id, $perPage);
    }

    public function updateProfile(User $user, UpdateUserDTO $dto): User
    {
        return $this->users->update($user, $dto->toArray());
    }

    public function updateProfilePhoto(User $user, UploadedFile $photo): User
    {
        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        return $this->users->update($user, [
            'profile_photo' => $photo->store('profiles', 'public'),
        ]);
    }

    public function follow(FollowUserDTO $dto): void
    {
        if ($dto->followerId === $dto->followingId) {
            throw ValidationException::withMessages([
                'user' => ['Nao e possivel seguir o proprio perfil.'],
            ]);
        }

        $this->users->findOrFail($dto->followingId);

        if ($this->users->isFollowing($dto->followerId, $dto->followingId)) {
            return;
        }

        $this->users->follow($dto->followerId, $dto->followingId);
        event(new UserFollowed($dto->followerId, $dto->followingId));
    }

    public function unfollow(FollowUserDTO $dto): void
    {
        $this->users->unfollow($dto->followerId, $dto->followingId);
    }

    public function followers(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return $this->users->followers($user, $perPage);
    }

    public function following(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return $this->users->following($user, $perPage);
    }
}
