<?php

namespace Database\Factories;

use App\Models\MemberRegistration;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MemberRegistration>
 */
class MemberRegistrationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'member_id' => null,
            'full_name' => fake()->name(),
            'nir' => fake()->unique()->numerify('############'),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->numerify('08##########'),
            'photo' => null,
            'instansi_id' => null,
            'kabupaten_kota_id' => null,
            'status' => 'draft',
            'submitted_at' => null,
            'reviewed_at' => null,
            'reviewed_by' => null,
            'rejection_reason' => null,
            'notes' => null,
        ];
    }

    /**
     * Indicate that the registration has been submitted.
     */
    public function submitted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);
    }
}
