<?php

namespace App\Services;

use App\DTOs\CreateCommentDTO;
use App\DTOs\UpdateCommentDTO;
use App\Events\CommentCreated;
use App\Models\Comment;
use App\Repositories\Contracts\CommentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CommentService
{
    public function __construct(private readonly CommentRepositoryInterface $comments)
    {
    }

    public function create(CreateCommentDTO $dto): Comment
    {
        $comment = $this->comments->create([
            'user_id' => $dto->userId,
            'post_id' => $dto->postId,
            'content' => $dto->content,
        ]);

        if ($comment->post->user_id !== $dto->userId) {
            event(new CommentCreated($comment->id, $dto->userId, $comment->post->user_id));
        }

        return $comment;
    }

    public function update(Comment $comment, UpdateCommentDTO $dto): Comment
    {
        return $this->comments->update($comment, ['content' => $dto->content]);
    }

    public function delete(Comment $comment): void
    {
        $this->comments->delete($comment);
    }

    public function forPost(int $postId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->comments->forPost($postId, $perPage);
    }
}
