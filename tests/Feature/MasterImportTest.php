<?php

use App\Models\Instansi;
use App\Models\KabupatenKota;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

uses(RefreshDatabase::class);

function makeCsvUpload(string $content): UploadedFile
{
    $path = tempnam(sys_get_temp_dir(), 'paricsv');
    file_put_contents($path, $content);

    return new UploadedFile($path, 'data.csv', 'text/csv', null, true);
}

test('tamu tidak dapat mengunduh template instansi', function () {
    $this->get(route('dashboard.master.instansi.template'))
        ->assertRedirect(route('login'));
});

test('template instansi dapat diunduh dengan baris contoh', function () {
    beAdmin();

    $response = $this->get(route('dashboard.master.instansi.template'));

    $response->assertOk();
    $response->assertDownload('template-instansi.csv');

    $content = $response->streamedContent();

    expect($content)->toStartWith("\xEF\xBB\xBF");
    expect($content)->toContain('nama;jenis;alamat;telepon;kabupaten_kota;is_active');
    expect($content)->toContain('RSUD Contoh Jambi', 'rumah_sakit', 'Kota Jambi');
});

test('import instansi menambah data dan wilayah baru otomatis', function () {
    beAdmin();

    $file = makeCsvUpload(
        "nama;jenis;alamat;telepon;kabupaten_kota;is_active\n"
            ."RSUD Raden Mattaher;Rumah Sakit;Jl. Soekarno Hatta;0741 1234;Kota Jambi;1\n"
            ."Puskesmas Simpang IV;puskesmas;;;Kota Jambi;\n",
    );

    $this->post(route('dashboard.master.instansi.import'), ['file' => $file])
        ->assertSessionHas('toast');

    expect(Instansi::count())->toBe(2);
    expect(KabupatenKota::count())->toBe(1);

    $kabupatenKota = KabupatenKota::first();

    $this->assertDatabaseHas('kabupaten_kota', ['name' => 'Kota Jambi']);
    $this->assertDatabaseHas('instansi', [
        'nama' => 'RSUD Raden Mattaher',
        'jenis' => 'rumah_sakit',
        'kabupaten_kota_id' => $kabupatenKota->id,
        'is_active' => true,
    ]);
    $this->assertDatabaseHas('instansi', [
        'nama' => 'Puskesmas Simpang IV',
        'jenis' => 'puskesmas',
        'kabupaten_kota_id' => $kabupatenKota->id,
        'is_active' => true,
    ]);

    $toast = session('toast');

    expect($toast['type'])->toBe('success');
    expect($toast['message'])->toContain('1 wilayah baru');
});

test('import instansi memperbarui data yang sudah ada', function () {
    beAdmin();

    $kabupatenKota = KabupatenKota::create(['name' => 'Kota Jambi']);

    Instansi::create([
        'nama' => 'RSUD Jambi',
        'jenis' => 'rumah_sakit',
        'kabupaten_kota_id' => $kabupatenKota->id,
        'is_active' => true,
    ]);

    $file = makeCsvUpload(
        "nama;jenis;alamat;telepon;kabupaten_kota;is_active\n"
            ."RSUD Jambi;puskesmas;Alamat Baru;0812 3456;Kota Jambi;0\n",
    );

    $this->post(route('dashboard.master.instansi.import'), ['file' => $file])
        ->assertSessionHas('toast');

    expect(Instansi::count())->toBe(1);
    expect(KabupatenKota::count())->toBe(1);
    $this->assertDatabaseHas('instansi', [
        'nama' => 'RSUD Jambi',
        'jenis' => 'puskesmas',
        'alamat' => 'Alamat Baru',
        'telepon' => '0812 3456',
        'kabupaten_kota_id' => $kabupatenKota->id,
        'is_active' => false,
    ]);
});

test('import instansi melaporkan baris dengan jenis atau nama tidak valid', function () {
    beAdmin();

    $file = makeCsvUpload(
        "nama;jenis;kabupaten_kota\n"
            ."RS X;poliklinik;Kota Tidak Ada\n"
            ." ;puskesmas;Kota Jambi\n"
            ."RSUD A;puskesmas;\n",
    );

    $this->post(route('dashboard.master.instansi.import'), ['file' => $file])
        ->assertSessionHas('toast');

    $toast = session('toast');

    expect($toast['type'])->toBe('warning');
    expect($toast['message'])->toContain('2 gagal');
    expect(Instansi::count())->toBe(1);
    expect(KabupatenKota::count())->toBe(0);
    $this->assertDatabaseHas('instansi', ['nama' => 'RSUD A', 'jenis' => 'puskesmas', 'kabupaten_kota_id' => null]);
});

test('import instansi menerima file dengan BOM dan separator koma', function () {
    beAdmin();

    $file = makeCsvUpload(
        "\xEF\xBB\xBFnama,jenis,kabupaten_kota\n"
            ."RSUD Kerinci,puskesmas,Kabupaten Kerinci\n",
    );

    $this->post(route('dashboard.master.instansi.import'), ['file' => $file])
        ->assertSessionHas('toast');

    $this->assertDatabaseHas('kabupaten_kota', ['name' => 'Kabupaten Kerinci']);
    $this->assertDatabaseHas('instansi', ['nama' => 'RSUD Kerinci', 'jenis' => 'puskesmas']);
});

test('import menolak file kosong', function () {
    beAdmin();

    $file = makeCsvUpload('');

    $this->post(route('dashboard.master.instansi.import'), ['file' => $file])
        ->assertSessionHas('toast');

    $toast = session('toast');

    expect($toast['type'])->toBe('error');
});

test('import menolak ketika file tidak diunggah', function () {
    beAdmin();

    $this->post(route('dashboard.master.instansi.import'), [])
        ->assertSessionHas('toast');

    $toast = session('toast');

    expect($toast['type'])->toBe('error');
});
