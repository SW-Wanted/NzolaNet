<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_like_creates_notification_for_post_owner_and_can_be_marked_read(): void
    {
        $owner = User::factory()->create();
        $sender = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $owner->id]);
        Sanctum::actingAs($sender);

        $this->postJson("/api/posts/{$post->id}/like")->assertCreated();

        $notificationId = $owner->notifications()->firstOrFail()->id;
        Sanctum::actingAs($owner);

        $this->patchJson("/api/notifications/{$notificationId}/read")
            ->assertOk()
            ->assertJsonPath('data.is_read', true);
    }
}
