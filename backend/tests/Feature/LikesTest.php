<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LikesTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_like_once_and_remove_like(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson("/api/posts/{$post->id}/like")
            ->assertCreated()
            ->assertJsonPath('data.likes_count', 1);

        $this->postJson("/api/posts/{$post->id}/like")
            ->assertUnprocessable()
            ->assertJsonPath('success', false);

        $this->deleteJson("/api/posts/{$post->id}/like")
            ->assertOk()
            ->assertJsonPath('data.likes_count', 0);
    }
}
