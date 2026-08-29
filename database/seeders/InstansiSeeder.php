<?php

namespace Database\Seeders;

use App\Models\Instansi;
use App\Models\KabupatenKota;
use Illuminate\Database\Seeder;

class InstansiSeeder extends Seeder
{
    /**
     * @var array<int, array{nama: string, jenis: string, kabupaten: string}>
     */
    private const DATA = [
        ['nama' => 'RSUD Raden Mattaher Jambi', 'jenis' => 'rumah_sakit', 'kabupaten' => 'Kota Jambi'],
        ['nama' => 'RS Siloam Hospitals Jambi', 'jenis' => 'rumah_sakit', 'kabupaten' => 'Kota Jambi'],
        ['nama' => 'RS Santa Theresia Jambi', 'jenis' => 'rumah_sakit', 'kabupaten' => 'Kota Jambi'],
        ['nama' => 'RS Bhayangkara Jambi', 'jenis' => 'rumah_sakit', 'kabupaten' => 'Kota Jambi'],
        ['nama' => 'Puskesmas Paal Merah', 'jenis' => 'puskesmas', 'kabupaten' => 'Kota Jambi'],
        ['nama' => 'Puskesmas Putri Ayu', 'jenis' => 'puskesmas', 'kabupaten' => 'Kota Jambi'],
        ['nama' => 'RSUD Sultan Thaha Saifuddin', 'jenis' => 'rumah_sakit', 'kabupaten' => 'Kabupaten Batanghari'],
        ['nama' => 'Puskesmas Muara Bulian', 'jenis' => 'puskesmas', 'kabupaten' => 'Kabupaten Batanghari'],
        ['nama' => 'RSUD H. Abdul Manap', 'jenis' => 'rumah_sakit', 'kabupaten' => 'Kabupaten Bungo'],
        ['nama' => 'Puskesmas Muara Bungo', 'jenis' => 'puskesmas', 'kabupaten' => 'Kabupaten Bungo'],
        ['nama' => 'RSUD Kerinci', 'jenis' => 'rumah_sakit', 'kabupaten' => 'Kabupaten Kerinci'],
        ['nama' => 'Puskesmas Siulak', 'jenis' => 'puskesmas', 'kabupaten' => 'Kabupaten Kerinci'],
        ['nama' => 'RSUD Merangin', 'jenis' => 'rumah_sakit', 'kabupaten' => 'Kabupaten Merangin'],
        ['nama' => 'Puskesmas Bangko', 'jenis' => 'puskesmas', 'kabupaten' => 'Kabupaten Merangin'],
        ['nama' => 'RSUD Muaro Jambi', 'jenis' => 'rumah_sakit', 'kabupaten' => 'Kabupaten Muaro Jambi'],
        ['nama' => 'Puskesmas Sengeti', 'jenis' => 'puskesmas', 'kabupaten' => 'Kabupaten Muaro Jambi'],
        ['nama' => 'RSUD H. Ahmad Ripin', 'jenis' => 'rumah_sakit', 'kabupaten' => 'Kabupaten Sarolangun'],
        ['nama' => 'Puskesmas Sarolangun', 'jenis' => 'puskesmas', 'kabupaten' => 'Kabupaten Sarolangun'],
        ['nama' => 'RSUD Tanjung Jabung Barat', 'jenis' => 'rumah_sakit', 'kabupaten' => 'Kabupaten Tanjung Jabung Barat'],
        ['nama' => 'Puskesmas Kuala Tungkal', 'jenis' => 'puskesmas', 'kabupaten' => 'Kabupaten Tanjung Jabung Barat'],
        ['nama' => 'RSUD Tanjung Jabung Timur', 'jenis' => 'rumah_sakit', 'kabupaten' => 'Kabupaten Tanjung Jabung Timur'],
        ['nama' => 'Puskesmas Muara Sabak', 'jenis' => 'puskesmas', 'kabupaten' => 'Kabupaten Tanjung Jabung Timur'],
        ['nama' => 'RSUD Tebo', 'jenis' => 'rumah_sakit', 'kabupaten' => 'Kabupaten Tebo'],
        ['nama' => 'Puskesmas Muara Tebo', 'jenis' => 'puskesmas', 'kabupaten' => 'Kabupaten Tebo'],
        ['nama' => 'RSUD Sungai Penuh', 'jenis' => 'rumah_sakit', 'kabupaten' => 'Kota Sungai Penuh'],
        ['nama' => 'Puskesmas Sungai Penuh', 'jenis' => 'puskesmas', 'kabupaten' => 'Kota Sungai Penuh'],
    ];

    public function run(): void
    {
        foreach (self::DATA as $item) {
            $kabupatenKota = KabupatenKota::where('name', $item['kabupaten'])->first();

            Instansi::updateOrCreate(['nama' => $item['nama']], [
                'jenis' => $item['jenis'],
                'kabupaten_kota_id' => $kabupatenKota?->id,
                'is_active' => true,
            ]);
        }
    }
}
