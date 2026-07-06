<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PostsTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_update_and_delete_own_post(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $created = $this->postJson('/api/posts', ['content' => 'Primeira publicacao NzolaNet'])
            ->assertCreated()
            ->assertJsonPath('data.content', 'Primeira publicacao NzolaNet')
            ->assertJsonPath('data.liked_by_me', false)
            ->assertJsonPath('data.can_update', true)
            ->assertJsonPath('data.can_delete', true)
            ->assertJsonStructure(['data' => ['image', 'image_url', 'video', 'video_url', 'author' => ['posts_count']]]);

        $postId = $created->json('data.id');

        $this->putJson("/api/posts/{$postId}", ['content' => 'Publicacao editada'])
            ->assertOk()
            ->assertJsonPath('data.content', 'Publicacao editada');

        $this->deleteJson("/api/posts/{$postId}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('posts', ['id' => $postId]);
    }

    public function test_user_cannot_edit_another_users_post(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $owner->id]);
        Sanctum::actingAs($other);

        $this->putJson("/api/posts/{$post->id}", ['content' => 'Tentativa indevida'])
            ->assertForbidden()
            ->assertJsonPath('success', false);
    }
}
