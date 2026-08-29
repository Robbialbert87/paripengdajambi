<?php

namespace Database\Factories;

use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Member>
 */
class MemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nir' => fake()->unique()->numerify('############'),
            'full_name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->numerify('08##########'),
            'photo' => null,
            'membership_status' => 'inactive',
            'directory_visible' => false,
            'verified_at' => null,
            'verified_by' => null,
        ];
    }

    /**
     * Indicate that the member is active and verified.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'membership_status' => 'active',
            'verified_at' => now(),
            'directory_visible' => true,
        ]);
    }
}
