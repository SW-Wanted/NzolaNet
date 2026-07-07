<?php

namespace App\Services;

use App\DTOs\CreatePostDTO;
use App\DTOs\UpdatePostDTO;
use App\Models\Post;
use App\Models\User;
use App\Repositories\Contracts\PostRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\LengthAwarePaginator as ConcreteLengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class PostService
{
    public function __construct(
        private readonly PostRepositoryInterface $posts,
        private readonly UserRepositoryInterface $users,
    ) {
    }

    public function create(CreatePostDTO $dto): Post
    {
        return $this->posts->create([
            'user_id' => $dto->userId,
            'content' => $dto->content,
            'image_path' => $dto->image?->store('posts/images', 'public'),
            'video_path' => $dto->video?->store('posts/videos', 'public'),
        ]);
    }

    public function update(Post $post, UpdatePostDTO $dto): Post
    {
        $data = [];

        if ($dto->content !== null) {
            $data['content'] = $dto->content;
        }

        if ($dto->removeImage && $post->image_path) {
            Storage::disk('public')->delete($post->image_path);
            $data['image_path'] = null;
        }

        if ($dto->removeVideo && $post->video_path) {
            Storage::disk('public')->delete($post->video_path);
            $data['video_path'] = null;
        }

        if ($dto->image) {
            if ($post->image_path) {
                Storage::disk('public')->delete($post->image_path);
            }
            $data['image_path'] = $dto->image->store('posts/images', 'public');
        }

        if ($dto->video) {
            if ($post->video_path) {
                Storage::disk('public')->delete($post->video_path);
            }
            $data['video_path'] = $dto->video->store('posts/videos', 'public');
        }

        return $this->posts->update($post, $data);
    }

    public function delete(Post $post): void
    {
        Storage::disk('public')->delete(array_filter([$post->image_path, $post->video_path]));
        $this->posts->delete($post);
    }

    public function list(int $perPage = 15): LengthAwarePaginator
    {
        return $this->posts->recent($perPage);
    }

    public function get(int $id): Post
    {
        return $this->posts->findOrFail($id);
    }

    public function byAuthor(User $viewer, int $authorId, int $perPage = 15): LengthAwarePaginator
    {
        $author = $this->users->findOrFail($authorId);

        $podeVer = ! $author->is_private
            || $viewer->is($author)
            || $viewer->isAdmin()
            || $this->users->isFollowing($viewer->id, $author->id);

        if (! $podeVer) {
            return new ConcreteLengthAwarePaginator([], 0, $perPage);
        }

        return $this->posts->byAuthor($authorId, $perPage);
    }
}
