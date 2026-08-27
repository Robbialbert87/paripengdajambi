<?php

namespace Database\Seeders;

use App\Models\OrganisasiAnggota;
use App\Models\OrganisasiBidang;
use App\Models\OrganisasiKontak;
use Illuminate\Database\Seeder;

class StrukturOrganisasiSeeder extends Seeder
{
    public function run(): void
    {
        OrganisasiBidang::query()->delete();
        OrganisasiAnggota::query()->delete();
        OrganisasiKontak::query()->delete();

        $bidangs = [
            ['nama' => 'Bid. Sekretariat', 'icon_key' => 'clipboard-list'],
            ['nama' => 'Bid. Advokasi Hukum dan Organisasi', 'icon_key' => 'scale'],
            ['nama' => 'Bid. Kaderisasi dan Pengembangan Profesi', 'icon_key' => 'graduation-cap'],
            ['nama' => 'Bid. IT dan Humas', 'icon_key' => 'monitor'],
            ['nama' => 'Bid. Bendahara', 'icon_key' => 'wallet'],
            ['nama' => 'Bid. Diklat dan Pelatihan', 'icon_key' => 'book-open'],
            ['nama' => 'Bid. Kesra dan Pengabdian Masyarakat', 'icon_key' => 'users'],
        ];

        $bidangIds = [];
        foreach ($bidangs as $i => $bidang) {
            $bidangIds[$bidang['nama']] = OrganisasiBidang::create([
                ...$bidang,
                'sort_order' => $i + 1,
            ])->id;
        }

        $advisors = [
            'Haryono, S.Si',
            'M. Untung Sukemi S, SKM, SST',
            'Pahmi, BSc',
            'Nurdin, AMR',
            'Mochamad Imron, S.Si, M.Tr. ID',
            'Nurhasan, Str. Kes (Rad)',
            'Landrayani, AMR',
        ];

        $advisorInitials = ['HY', 'MU', 'PM', 'ND', 'MI', 'NH', 'LR'];

        foreach ($advisors as $i => $nama) {
            OrganisasiAnggota::create([
                'nama' => $nama,
                'inisial' => $advisorInitials[$i],
                'kategori' => 'pembina_penasihat',
                'sort_order' => $i + 1,
            ]);
        }

        OrganisasiAnggota::create([
            'nama' => 'Alen Rizaldi, AMR., S.KM',
            'inisial' => 'AR',
            'kategori' => 'ketua_umum',
            'sort_order' => 1,
        ]);

        $ketuas = [
            'Bid. Sekretariat' => ['Wali Ikhwan, A.Md. Rad', 'WI'],
            'Bid. Advokasi Hukum dan Organisasi' => ['Barenton, Am.Rad', 'BR'],
            'Bid. Kaderisasi dan Pengembangan Profesi' => ['Aris Yeni Susanti, Amd. Rad', 'AS'],
            'Bid. IT dan Humas' => ['Muhammad Iqbal, AM.Rad', 'MI'],
            'Bid. Diklat dan Pelatihan' => ['Diah Wulansari, Amd.Rad', 'DW'],
            'Bid. Kesra dan Pengabdian Masyarakat' => ['M. Edo Kurniawan, S.SiT', 'ME'],
        ];

        $anggotaPerBidang = [
            'Bid. Sekretariat' => [
                ['Resti Muharrami, A.Md. Rad', 'RM'],
                ['Sandini, Amd. Rad', 'SN'],
                ['Marlengga, AMR', 'ML'],
            ],
            'Bid. Advokasi Hukum dan Organisasi' => [
                ['Amri Ramadhani, Am.Rad', 'AR'],
                ['Endi Ikhwanda, Am.Rad', 'EI'],
                ['Rina Faridah, Amd. Rad', 'RF'],
            ],
            'Bid. Kaderisasi dan Pengembangan Profesi' => [
                ['Ekapurna Widyastuti A.A, AMR', 'EW'],
                ['Fernandes, S.Tr.Rad', 'FN'],
                ['Fathul Abrar Ilyas, S.Tr.Kes', 'FA'],
            ],
            'Bid. IT dan Humas' => [
                ['Erika Ayu Ningsih, Amd.Rad', 'EN'],
                ['Azizah Aswar, A.Md.Kes(Rad)', 'AA'],
                ['Fauzan Pratama, Amd.Rad', 'FP'],
            ],
            'Bid. Bendahara' => [
                ['Christine WA, AMR', 'CW'],
                ['Yuniarti, AMR', 'YN'],
                ['Tesa Meilani, AMR', 'TM'],
            ],
            'Bid. Diklat dan Pelatihan' => [
                ['Hamidah, A.md Rad', 'HM'],
                ['Swangga Bagus Winarta, Am.Rad', 'SW'],
                ['Angga Agustiar, A.Md.Rad, SKM', 'AA'],
            ],
            'Bid. Kesra dan Pengabdian Masyarakat' => [
                ['M. Dodo Hernando, AMR', 'DH'],
                ['Elga Emertha, AM.Rad', 'EE'],
                ['Cindy Khairidea Sari, A.Md.Kes Rad', 'CK'],
            ],
        ];

        foreach ($ketuas as $bidangNama => [$nama, $inisial]) {
            OrganisasiAnggota::create([
                'nama' => $nama,
                'inisial' => $inisial,
                'kategori' => 'ketua_bidang',
                'bidang_id' => $bidangIds[$bidangNama],
                'sort_order' => 1,
            ]);
        }

        foreach ($anggotaPerBidang as $bidangNama => $anggotaList) {
            foreach ($anggotaList as $i => [$anggotaNama, $anggotaInisial]) {
                OrganisasiAnggota::create([
                    'nama' => $anggotaNama,
                    'inisial' => $anggotaInisial,
                    'kategori' => 'anggota',
                    'bidang_id' => $bidangIds[$bidangNama],
                    'sort_order' => $i + 1,
                ]);
            }
        }

        $kontaks = [
            ['Ikhwan', '08537443 8754'],
            ['Sandini', '08123485 0713'],
            ['Resti', '08570964 5434'],
            ['Marlengga', '08526611 8568'],
        ];

        foreach ($kontaks as $i => [$nama, $telepon]) {
            OrganisasiKontak::create([
                'nama' => $nama,
                'telepon' => $telepon,
                'sort_order' => $i + 1,
            ]);
        }
    }
}
