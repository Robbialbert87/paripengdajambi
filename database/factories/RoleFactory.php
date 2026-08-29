<?php

namespace Database\Factories;

use App\Models\Role;
use App\Support\PermissionCatalog;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Role>
 */
class RoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->word();

        return [
            'name' => Str::title($name),
            'slug' => Str::slug($name),
            'permissions' => [],
        ];
    }

    public function member(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Member',
            'slug' => 'member',
            'permissions' => PermissionCatalog::defaults('member'),
        ]);
    }

    public function pengurus(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Pengurus',
            'slug' => 'pengurus',
            'permissions' => PermissionCatalog::defaults('pengurus'),
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Admin',
            'slug' => 'admin',
            'permissions' => PermissionCatalog::defaults('admin'),
        ]);
    }
}
