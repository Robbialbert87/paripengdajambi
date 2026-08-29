<?php

namespace Database\Seeders;

use App\Models\KabupatenKota;
use Illuminate\Database\Seeder;

class KabupatenKotaSeeder extends Seeder
{
    public function run(): void
    {
        $names = [
            'Kota Jambi',
            'Kota Sungai Penuh',
            'Kabupaten Batanghari',
            'Kabupaten Bungo',
            'Kabupaten Kerinci',
            'Kabupaten Merangin',
            'Kabupaten Muaro Jambi',
            'Kabupaten Sarolangun',
            'Kabupaten Tanjung Jabung Barat',
            'Kabupaten Tanjung Jabung Timur',
            'Kabupaten Tebo',
        ];

        foreach ($names as $name) {
            KabupatenKota::updateOrCreate(['name' => $name]);
        }
    }
}
