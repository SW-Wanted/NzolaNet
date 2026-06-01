<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_login_get_current_user_and_logout(): void
    {
        $register = $this->postJson('/api/auth/register', [
            'name' => 'Maria Nzola',
            'email' => 'maria@nzolanet.local',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $register->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['access_token', 'token_type', 'user' => ['id', 'name', 'email']]]);

        $login = $this->postJson('/api/auth/login', [
            'email' => 'maria@nzolanet.local',
            'password' => 'password123',
        ]);

        $login->assertOk()->assertJsonPath('data.token_type', 'Bearer');
        $token = (string) $login->json('data.access_token');

        $this->withHeader('Authorization', "Bearer {$token}")->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'maria@nzolanet.local');

        $this->withHeader('Authorization', "Bearer {$token}")->postJson('/api/auth/logout')
            ->assertOk()
            ->assertJsonPath('success', true);
    }
}
