<?php

namespace App\Services;

use App\Events\PostLiked;
use App\Models\Post;
use App\Repositories\Contracts\LikeRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class LikeService
{
    public function __construct(private readonly LikeRepositoryInterface $likes)
    {
    }

    public function like(int $userId, Post $post): int
    {
        if ($this->likes->exists($userId, $post->id)) {
            throw ValidationException::withMessages([
                'post' => ['Este utilizador ja deu baze nesta publicacao.'],
            ]);
        }

        $like = $this->likes->create($userId, $post->id);

        if ($like->wasRecentlyCreated && $post->user_id !== $userId) {
            event(new PostLiked($userId, $post->id, $post->user_id));
        }

        return $this->likes->countForPost($post->id);
    }

    public function unlike(int $userId, Post $post): int
    {
        $this->likes->delete($userId, $post->id);

        return $this->likes->countForPost($post->id);
    }

    public function usersForPost(Post $post): Collection
    {
        return $this->likes->usersForPost($post->id);
    }
}
