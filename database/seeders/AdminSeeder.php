<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    public const ADMIN_EMAIL = 'admin@paripengdajambi.com';

    public function run(): void
    {
        $adminRole = Role::where('slug', 'admin')->firstOrFail();

        $admin = User::where('email', self::ADMIN_EMAIL)->first();

        if (! $admin) {
            $admin = User::create([
                'name' => 'Admin PARI',
                'email' => self::ADMIN_EMAIL,
                'password' => $this->placeholderPassword(),
                'email_verified_at' => now(),
            ]);
        }

        if ($admin->role_id !== $adminRole->id) {
            $admin->update(['role_id' => $adminRole->id]);
        }
    }

    private function placeholderPassword(): string
    {
        $password = config('app.admin_default_password');

        if (is_string($password) && $password !== '') {
            return Hash::make($password);
        }

        $placeholder = Str::random(48);

        $this->command->warn(
            'Akun admin baru dibuat dengan password acak (tidak untuk login). '
            .'Atur password via env ADMIN_DEFAULT_PASSWORD lalu jalankan seeder ulang, '
            .'atau gunakan fitur reset password.',
        );

        return Hash::make($placeholder);
    }
}
