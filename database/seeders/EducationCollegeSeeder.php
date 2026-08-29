<?php

namespace Database\Seeders;

use App\Models\EducationCollege;
use Illuminate\Database\Seeder;

class EducationCollegeSeeder extends Seeder
{
    public function run(): void
    {
        $colleges = [
            ['name' => 'Poltekkes Kemenkes Jakarta II', 'type' => 'negeri', 'kind' => 'politeknik'],
            ['name' => 'Poltekkes Kemenkes Semarang', 'type' => 'negeri', 'kind' => 'politeknik'],
            ['name' => 'Poltekkes Kemenkes Yogyakarta', 'type' => 'negeri', 'kind' => 'politeknik'],
            ['name' => 'Poltekkes Kemenkes Denpasar', 'type' => 'negeri', 'kind' => 'politeknik'],
            ['name' => 'Politeknik Kesehatan TNI AU Adisutjipto', 'type' => 'negeri', 'kind' => 'politeknik'],
            ['name' => 'AKTEK Radiodiagnostik dan Radioterapi Bali', 'type' => 'negeri', 'kind' => 'akademi'],
            ['name' => 'Universitas Diponegoro', 'type' => 'negeri', 'kind' => 'universitas'],
            ['name' => 'Akademi Teknik Radiodiagnostik dan Radioterapi (ATRO) Yogyakarta', 'type' => 'swasta', 'kind' => 'akademi'],
            ['name' => 'Akademi Teknik Radiodiagnostik dan Radioterapi Nusantara', 'type' => 'swasta', 'kind' => 'akademi'],
            ['name' => 'Akademi Teknik Radiodiagnostik dan Radioterapi Yapenpernus', 'type' => 'swasta', 'kind' => 'akademi'],
            ['name' => 'Akademi Teknik Radiodiagnostik dan Radioterapi Widya Dharma', 'type' => 'swasta', 'kind' => 'akademi'],
            ['name' => 'Akademi Teknik Radiodiagnostik dan Radioterapi Patriot Bangsa', 'type' => 'swasta', 'kind' => 'akademi'],
            ['name' => 'AKTEK Radiodiagnostik dan Terapi Citra Intan Persada', 'type' => 'swasta', 'kind' => 'akademi'],
            ['name' => 'ATRO Yayasan Amal Bhakti Medan', 'type' => 'swasta', 'kind' => 'akademi'],
            ['name' => 'Akademi Pendidikan Kesehatan Talitakum', 'type' => 'swasta', 'kind' => 'akademi'],
            ['name' => 'Universitas Kader Bangsa', 'type' => 'swasta', 'kind' => 'universitas'],
            ['name' => 'Universitas Efarina', 'type' => 'swasta', 'kind' => 'universitas'],
            ['name' => 'Universitas Baiturrahmah', 'type' => 'swasta', 'kind' => 'universitas'],
            ['name' => 'Universitas Aisyiyah Yogyakarta', 'type' => 'swasta', 'kind' => 'universitas'],
            ['name' => 'Universitas Awal Bros', 'type' => 'swasta', 'kind' => 'universitas'],
            ['name' => 'Universitas Widya Husada Semarang', 'type' => 'swasta', 'kind' => 'universitas'],
            ['name' => 'Universitas Muhammadiyah Semarang', 'type' => 'swasta', 'kind' => 'universitas'],
            ['name' => 'Universitas Muhammadiyah Yogyakarta', 'type' => 'swasta', 'kind' => 'universitas'],
            ['name' => 'Politeknik Kesehatan Muhammadiyah Makassar', 'type' => 'swasta', 'kind' => 'politeknik'],
            ['name' => 'Politeknik Al-Islam Bandung', 'type' => 'swasta', 'kind' => 'politeknik'],
            ['name' => 'STIKES An Nasher Cirebon', 'type' => 'swasta', 'kind' => 'sekolah_tinggi'],
            ['name' => 'STIKES Guna Bangsa Yogyakarta', 'type' => 'swasta', 'kind' => 'sekolah_tinggi'],
            ['name' => 'STIKES Senior Medan', 'type' => 'swasta', 'kind' => 'sekolah_tinggi'],
            ['name' => 'STIKES Patriot Bangsa Lampung', 'type' => 'swasta', 'kind' => 'sekolah_tinggi'],
            ['name' => 'STIKES Borneo Nusantara', 'type' => 'swasta', 'kind' => 'sekolah_tinggi'],
            ['name' => 'STIKES Maluku Husada', 'type' => 'swasta', 'kind' => 'sekolah_tinggi'],
            ['name' => 'STIKES Pertamedika', 'type' => 'swasta', 'kind' => 'sekolah_tinggi'],
            ['name' => 'STIKES Cirebon', 'type' => 'swasta', 'kind' => 'sekolah_tinggi'],
            ['name' => 'STIKES Widya Husada Semarang', 'type' => 'swasta', 'kind' => 'sekolah_tinggi'],
            ['name' => 'Institut Ilmu Kesehatan STRADA Indonesia', 'type' => 'swasta', 'kind' => 'institut'],
            ['name' => 'Institut Teknologi Kesehatan Malang Widya Cipta Husada', 'type' => 'swasta', 'kind' => 'institut'],
        ];

        foreach ($colleges as $college) {
            EducationCollege::firstOrCreate(['name' => $college['name']], $college);
        }
    }
}
