<?php

namespace Tests\Unit;

use App\Models\Post;
use App\Models\User;
use App\Repositories\Eloquent\EloquentLikeRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EloquentLikeRepositoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_repository_creates_like_idempotently_and_counts_post_likes(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        $repository = new EloquentLikeRepository();

        $repository->create($user->id, $post->id);
        $repository->create($user->id, $post->id);

        $this->assertTrue($repository->exists($user->id, $post->id));
        $this->assertSame(1, $repository->countForPost($post->id));
    }
}
