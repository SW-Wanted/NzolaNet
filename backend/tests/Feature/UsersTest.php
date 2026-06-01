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
            ->assertJsonPath('data.is_private', true);

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
