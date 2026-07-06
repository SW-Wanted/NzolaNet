<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CommentsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_update_and_delete_own_comment(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        Sanctum::actingAs($user);

        $created = $this->postJson("/api/posts/{$post->id}/comments", ['content' => 'Gostei da publicacao'])
            ->assertCreated()
            ->assertJsonPath('data.content', 'Gostei da publicacao');

        $commentId = $created->json('data.id');

        $this->putJson("/api/comments/{$commentId}", ['content' => 'Comentario editado'])
            ->assertOk()
            ->assertJsonPath('data.content', 'Comentario editado');

        $this->deleteJson("/api/comments/{$commentId}")
            ->assertOk();

        $this->assertDatabaseMissing('comments', ['id' => $commentId]);
    }

    public function test_admin_can_remove_any_comment(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin->value]);
        $comment = Comment::factory()->create();
        Sanctum::actingAs($admin);

        $this->deleteJson("/api/admin/comments/{$comment->id}")
            ->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_admin_can_list_comments_for_moderation(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin->value]);
        $comment = Comment::factory()->create(['content' => 'Comentario para moderacao']);
        Sanctum::actingAs($admin);

        $this->getJson('/api/admin/comments')
            ->assertOk()
            ->assertJsonPath('data.data.0.id', $comment->id)
            ->assertJsonPath('data.data.0.content', 'Comentario para moderacao')
            ->assertJsonStructure(['data' => ['data' => [['author' => ['posts_count'], 'can_delete']]]]);
    }
}
