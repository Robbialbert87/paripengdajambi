<?php

namespace Database\Factories;

use App\Models\MemberRegistration;
use App\Models\MemberRegistrationLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MemberRegistrationLog>
 */
class MemberRegistrationLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = MemberRegistration::STATUSES;

        return [
            'registration_id' => MemberRegistration::factory(),
            'status' => $statuses[array_rand($statuses)],
            'note' => null,
            'performed_by' => null,
        ];
    }
}
