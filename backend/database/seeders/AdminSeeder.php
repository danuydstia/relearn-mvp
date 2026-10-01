<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        if (User::where('role', User::ROLE_ADMIN)->exists()) {
            $this->command->info('Admin sudah ada, skip.');
            return;
        }

        User::create([
            'name' => 'Admin ReLearn',
            'email' => 'admin@gmail.com',
            'password' => '12345678',
            'role' => User::ROLE_ADMIN,
            'email_verified_at' => now(),
        ]);

        $this->command->info('Admin berhasil dibuat: admin@gmail.com');
    }
}