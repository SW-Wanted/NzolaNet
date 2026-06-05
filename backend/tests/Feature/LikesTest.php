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

    public function test_user_can_list_people_who_liked_a_post(): void
    {
        $viewer = User::factory()->create();
        $liker = User::factory()->create(['name' => 'Maria Nzola']);
        $post = Post::factory()->create();
        Sanctum::actingAs($liker);

        $this->postJson("/api/posts/{$post->id}/like")
            ->assertCreated();

        Sanctum::actingAs($viewer);

        $this->getJson("/api/posts/{$post->id}/likes")
            ->assertOk()
            ->assertJsonPath('data.0.id', $liker->id)
            ->assertJsonPath('data.0.name', 'Maria Nzola');
    }
}
