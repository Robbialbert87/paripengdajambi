<?php

namespace Database\Seeders;

use App\Models\TteRecord;
use Illuminate\Database\Seeder;

class TteRecordSeeder extends Seeder
{
    public function run(): void
    {
        TteRecord::updateOrCreate(
            ['nomor_anggota' => '1571041103019'],
            [
                'nama_lengkap' => 'Alen Rizaldi',
                'jabatan' => 'Ketua PARI (Perhimpunan Radiografer Indonesia) Pengda Provinsi Jambi',
                'tahun_mulai' => 2024,
                'tahun_selesai' => 2028,
                'is_active' => true,
            ]
        );
    }
}
