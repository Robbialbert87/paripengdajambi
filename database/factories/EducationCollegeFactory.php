<?php

namespace Database\Factories;

use App\Models\EducationCollege;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EducationCollege>
 */
class EducationCollegeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->company().' Radiologi',
            'type' => 'swasta',
            'kind' => 'sekolah_tinggi',
        ];
    }
}
