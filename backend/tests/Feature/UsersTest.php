<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UsersTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_profile_and_follow_unfollow_another_user(): void
    {
        $viewer = User::factory()->create();
        $target = User::factory()->create();
        Sanctum::actingAs($viewer);

        $this->putJson('/api/users/profile', [
            'name' => 'Novo Nome',
            'bio' => 'Cultura, danca e tecnologia.',
            'is_private' => true,
        ])->assertOk()
            ->assertJsonPath('data.name', 'Novo Nome')
            ->assertJsonPath('data.is_private', true)
            ->assertJsonStructure(['data' => ['followers_count', 'following_count', 'posts_count']]);

        $this->postJson("/api/users/{$target->id}/follow")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('followers', [
            'follower_id' => $viewer->id,
            'following_id' => $target->id,
        ]);

        $this->deleteJson("/api/users/{$target->id}/follow")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('followers', [
            'follower_id' => $viewer->id,
            'following_id' => $target->id,
        ]);
    }

    public function test_user_listing_includes_follow_state_and_counts(): void
    {
        $viewer = User::factory()->create();
        $target = User::factory()->hasPosts(2)->create();
        $viewer->following()->attach($target->id);
        Sanctum::actingAs($viewer);

        $this->getJson('/api/users?per_page=10')
            ->assertOk()
            ->assertJsonFragment([
                'id' => $target->id,
                'is_following' => true,
                'posts_count' => 2,
            ]);
    }

    public function test_private_profile_requires_follow_permission(): void
    {
        $viewer = User::factory()->create();
        $privateUser = User::factory()->create(['is_private' => true]);
        Sanctum::actingAs($viewer);

        $this->getJson("/api/users/{$privateUser->id}")
            ->assertForbidden()
            ->assertJsonPath('success', false);
    }
}
