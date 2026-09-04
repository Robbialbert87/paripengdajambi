<?php

use App\Models\Instansi;
use App\Models\KabupatenKota;
use App\Models\MemberRegistration;
use Inertia\Testing\AssertableInertia as Assert;

test('rekap modality dikelompokkan per instansi dan mengabaikan non-approved', function () {
    beAdmin();

    $kotaJambi = KabupatenKota::create(['name' => 'Kota Jambi']);

    $rsA = Instansi::create([
        'nama' => 'RSUD Mattaher',
        'jenis' => 'rumah_sakit',
        'kabupaten_kota_id' => $kotaJambi->id,
    ]);
    $puskesmas = Instansi::create([
        'nama' => 'Puskesmas Olak Kemang',
        'jenis' => 'puskesmas',
        'kabupaten_kota_id' => null,
    ]);

    MemberRegistration::factory()->create([
        'instansi_id' => $rsA->id,
        'status' => 'approved',
        'modalities' => ['dr', 'ct_scan'],
    ]);
    MemberRegistration::factory()->create([
        'instansi_id' => $rsA->id,
        'status' => 'approved',
        'modalities' => ['dr'],
    ]);
    MemberRegistration::factory()->create([
        'instansi_id' => $puskesmas->id,
        'status' => 'approved',
        'modalities' => ['mri'],
    ]);
    MemberRegistration::factory()->create([
        'instansi_id' => $rsA->id,
        'status' => 'submitted',
        'modalities' => ['usg'],
    ]);

    $this->get(route('dashboard.master.modality-rekap'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/master/modality-rekap')
            ->has('instansi', 2)
            ->where('instansi.0.nama', 'Puskesmas Olak Kemang')
            ->where('instansi.0.modalities', ['mri'])
            ->where('instansi.0.wilayah', 'Tanpa wilayah')
            ->where('instansi.0.jumlah_modalities', 1)
            ->where('instansi.1.nama', 'RSUD Mattaher')
            ->where('instansi.1.modalities', ['ct_scan', 'dr'])
            ->where('instansi.1.modality_search', 'CT Scan DR (Digital Radiography)')
            ->where('instansi.1.wilayah', 'Kota Jambi')
            ->where('instansi.1.jumlah_modalities', 2)
            ->has('modalityOptions', 8)
            ->has('wilayahOptions', 1)
            ->where('wilayahOptions.0', 'Kota Jambi'));
});

test('rekap modality menampilkan data kosong bila belum ada instansi terverifikasi', function () {
    beAdmin();

    $this->get(route('dashboard.master.modality-rekap'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/master/modality-rekap')
            ->has('instansi', 0)
            ->has('wilayahOptions', 0));
});

test('non-admin tidak dapat mengakses rekap modality', function () {
    beMember();

    $this->get(route('dashboard.master.modality-rekap'))->assertForbidden();
});
