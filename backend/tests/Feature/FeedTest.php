<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FeedTest extends TestCase
{
    use RefreshDatabase;

    public function test_following_feed_returns_posts_from_followed_users(): void
    {
        $viewer = User::factory()->create();
        $followed = User::factory()->create();
        $notFollowed = User::factory()->create();
        $viewer->following()->attach($followed->id);

        $visible = Post::factory()->create(['user_id' => $followed->id, 'content' => 'Post seguido']);
        Post::factory()->create(['user_id' => $notFollowed->id, 'content' => 'Post externo']);
        Sanctum::actingAs($viewer);

        $response = $this->getJson('/api/feed/following')
            ->assertOk()
            ->assertJsonPath('success', true);

        $ids = collect($response->json('data'))->pluck('id');
        $this->assertTrue($ids->contains($visible->id));
        $this->assertCount(1, $ids);
    }
}
