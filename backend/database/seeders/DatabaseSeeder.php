<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->updateOrCreate([
            'email' => 'admin@nzolanet.local',
        ], [
            'name' => 'Administrador NzolaNet',
            'password' => Hash::make('Admin@123456'),
            'role' => UserRole::Admin->value,
            'is_private' => false,
        ]);
    }
}
