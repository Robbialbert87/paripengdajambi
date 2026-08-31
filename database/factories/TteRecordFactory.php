<?php

namespace Database\Factories;

use App\Models\TteRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TteRecord>
 */
class TteRecordFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_lengkap' => fake()->name(),
            'nomor_anggota' => fake()->unique()->numerify('##########'),
            'jabatan' => fake()->jobTitle(),
            'tahun_mulai' => fake()->numberBetween(2000, 2020),
            'tahun_selesai' => fake()->numberBetween(2021, 2030),
            'is_active' => false,
        ];
    }
}
