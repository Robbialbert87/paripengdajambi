<?php

use App\Models\EducationCollege;
use App\Models\Instansi;
use App\Models\KabupatenKota;
use App\Models\Member;
use App\Models\MemberRegistration;
use App\Models\MemberRegistrationLog;
use Database\Seeders\EducationCollegeSeeder;
use Database\Seeders\InstansiSeeder;
use Database\Seeders\KabupatenKotaSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

function makeRegistrationPayload(array $overrides = []): array
{
    $kabupatenKota = KabupatenKota::create(['name' => 'Kota Jambi Test']);
    $instansi = Instansi::create([
        'nama' => 'RSUD Test',
        'jenis' => 'rumah_sakit',
        'kabupaten_kota_id' => $kabupatenKota->id,
    ]);

    return array_merge([
        'full_name' => 'Budi Radiografer',
        'nik' => '1565091407900001',
        'nir' => '1571041103019',
        'email' => 'budi@test.example',
        'phone' => '081234567890',
        'gender' => 'male',
        'blood_type' => 'O',
        'religion' => 'islam',
        'birth_date' => '1990-05-14',
        'home_address' => 'Jl. Mawar No. 1, Jambi',
        'employment_status' => 'pns',
        'kabupaten_kota_id' => $kabupatenKota->id,
        'instansi_id' => $instansi->id,
        'str_number' => 'STR-2024-00123',
        'str_status' => 'seumur_hidup',
        'str_expiry_date' => null,
        'education_college_id' => null,
        'education_institution' => 'STIKES Contoh Jambi',
        'education_level' => 'd3',
        'diploma_number' => 'DIP-2024-001',
        'graduation_year' => '2015',
        'diploma_file' => UploadedFile::fake()->create('ijazah.pdf', 50, 'application/pdf'),
        'field' => 'radiodiagnostik',
        'photo' => UploadedFile::fake()->image('foto.jpg', 600, 800),
    ], $overrides);
}

test('kabupaten_kota dan instansi dikirim ke halaman registrasi', function () {
    KabupatenKota::create(['name' => 'Kota Jambi']);
    Instansi::create(['nama' => 'RSUD Test', 'jenis' => 'rumah_sakit']);

    $this->get(route('keanggotaan.registrasi'))
        ->assertInertia(fn ($page) => $page
            ->component('keanggotaan/registrasi')
            ->has('kabupatenKota', 1)
            ->has('instansi', 1));
});

test('submit registrasi berhasil dengan nomor, status, log, dan foto', function () {
    $response = $this->post(route('keanggotaan.registrasi.store'), makeRegistrationPayload());

    $registration = MemberRegistration::firstOrFail();

    $response->assertRedirect(route('keanggotaan.status', ['nir' => $registration->nir]));

    expect($registration)
        ->full_name->toBe('Budi Radiografer')
        ->nik->toBe('1565091407900001')
        ->email->toBe('budi@test.example')
        ->gender->toBe('male')
        ->blood_type->toBe('O')
        ->religion->toBe('islam')
        ->birth_date->format('Y-m-d')->toBe('1990-05-14')
        ->home_address->toBe('Jl. Mawar No. 1, Jambi')
        ->employment_status->toBe('pns')
        ->str_number->toBe('STR-2024-00123')
        ->str_status->toBe('seumur_hidup')
        ->str_expiry_date->toBeNull()
        ->education_institution->toBe('STIKES Contoh Jambi')
        ->education_level->toBe('d3')
        ->diploma_number->toBe('DIP-2024-001')
        ->graduation_year->toBe(2015)
        ->field->toBe('radiodiagnostik')
        ->status->toBe('submitted')
        ->photo->toMatch('/^registrasi\/.+\.webp$/');

    expect(MemberRegistrationLog::where('registration_id', $registration->id)->count())->toBe(1)
        ->and(MemberRegistrationLog::where('registration_id', $registration->id)->first()->status)->toBe('submitted');

    Storage::disk('public')->assertExists($registration->photo);
    Storage::disk('public')->assertExists($registration->diploma_file);

    Storage::disk('public')->delete($registration->photo);
    Storage::disk('public')->delete($registration->diploma_file);
});

test('institusi pendidikan dari daftar tersimpan otomatis', function () {
    $college = EducationCollege::create(['name' => 'Poltekkes Kemenkes Semarang', 'type' => 'negeri', 'kind' => 'politeknik']);

    $payload = makeRegistrationPayload([
        'education_college_id' => $college->id,
        'education_institution' => $college->name,
    ]);

    $this->post(route('keanggotaan.registrasi.store'), $payload)
        ->assertRedirect();

    $registration = MemberRegistration::firstOrFail();

    expect($registration->education_college_id)->toBe($college->id)
        ->and($registration->education_institution)->toBe('Poltekkes Kemenkes Semarang');
});

test('validasi gagal saat field wajib tidak diisi', function () {
    $this->from(route('keanggotaan.registrasi'))
        ->post(route('keanggotaan.registrasi.store'), [])
        ->assertSessionHasErrors([
            'full_name',
            'nik',
            'nir',
            'email',
            'phone',
            'gender',
            'blood_type',
            'religion',
            'birth_date',
            'home_address',
            'employment_status',
            'kabupaten_kota_id',
            'instansi_id',
            'str_number',
            'str_status',
            'education_institution',
            'education_level',
            'diploma_number',
            'graduation_year',
            'diploma_file',
            'field',
            'photo',
        ]);
});

test('pas foto wajib diunggah', function () {
    $payload = makeRegistrationPayload();
    unset($payload['photo']);

    $this->post(route('keanggotaan.registrasi.store'), $payload)
        ->assertSessionHasErrors('photo');
});

test('scan ijazah wajib diunggah', function () {
    $payload = makeRegistrationPayload();
    unset($payload['diploma_file']);

    $this->post(route('keanggotaan.registrasi.store'), $payload)
        ->assertSessionHasErrors('diploma_file');
});

test('scan ijazah harus berupa file PDF', function () {
    $payload = makeRegistrationPayload([
        'diploma_file' => UploadedFile::fake()->create('ijazah.txt', 10, 'text/plain'),
    ]);

    $this->post(route('keanggotaan.registrasi.store'), $payload)
        ->assertSessionHasErrors('diploma_file');
});

test('tanggal lahir tidak boleh di masa depan', function () {
    $payload = makeRegistrationPayload(['birth_date' => now()->addDay()->format('Y-m-d')]);

    $this->post(route('keanggotaan.registrasi.store'), $payload)
        ->assertSessionHasErrors('birth_date');
});

test('NIK harus 16 digit angka', function () {
    $payload = makeRegistrationPayload(['nik' => '12345678']);

    $this->post(route('keanggotaan.registrasi.store'), $payload)
        ->assertSessionHasErrors('nik');
});

test('STR sementara wajib mengisi masa berlaku', function () {
    $payload = makeRegistrationPayload([
        'str_status' => 'sementara',
        'str_expiry_date' => null,
    ]);

    $this->post(route('keanggotaan.registrasi.store'), $payload)
        ->assertSessionHasErrors('str_expiry_date');
});

test('STR seumur hidup tidak wajib mengisi masa berlaku', function () {
    $payload = makeRegistrationPayload([
        'str_status' => 'sementara',
        'str_expiry_date' => now()->addYear()->format('Y-m-d'),
    ]);

    $this->post(route('keanggotaan.registrasi.store'), $payload)
        ->assertRedirect();
});

test('NIR yang sudah menjadi member terblokir', function () {
    Member::factory()->create(['nir' => '1571041103019']);

    $this->post(route('keanggotaan.registrasi.store'), makeRegistrationPayload())
        ->assertSessionHasErrors('nir');

    expect(MemberRegistration::count())->toBe(0);
});

test('NIK yang sudah menjadi member terblokir', function () {
    Member::factory()->create(['nik' => '1565091407900001']);

    $this->post(route('keanggotaan.registrasi.store'), makeRegistrationPayload())
        ->assertSessionHasErrors('nik');

    expect(MemberRegistration::count())->toBe(0);
});

test('NIR yang masih pending terblokir', function () {
    MemberRegistration::factory()->submitted()->create(['nir' => '1571041103019']);

    $this->post(route('keanggotaan.registrasi.store'), makeRegistrationPayload())
        ->assertSessionHasErrors('nir');
});

test('NIK yang masih pending terblokir', function () {
    MemberRegistration::factory()->submitted()->create(['nik' => '1565091407900001']);

    $this->post(route('keanggotaan.registrasi.store'), makeRegistrationPayload())
        ->assertSessionHasErrors('nik');
});

test('email yang masih pending terblokir', function () {
    MemberRegistration::factory()->submitted()->create(['email' => 'budi@test.example']);

    $this->post(route('keanggotaan.registrasi.store'), makeRegistrationPayload())
        ->assertSessionHasErrors('email');
});

test('daftar ulang diizinkan setelah status rejected', function () {
    MemberRegistration::factory()->create([
        'nir' => '1571041103019',
        'email' => 'budi@test.example',
        'status' => 'rejected',
    ]);

    $this->post(route('keanggotaan.registrasi.store'), makeRegistrationPayload())
        ->assertRedirect();

    expect(MemberRegistration::count())->toBe(2);
});

test('halaman status menampilkan hasil dari query parameter', function () {
    $registration = MemberRegistration::factory()->submitted()->create();
    MemberRegistrationLog::factory()->create([
        'registration_id' => $registration->id,
        'status' => 'submitted',
    ]);

    $this->get(route('keanggotaan.status', ['nir' => $registration->nir]))
        ->assertInertia(fn ($page) => $page
            ->component('keanggotaan/status')
            ->where('registration.nir', $registration->nir)
            ->has('registration.logs', 1));
});

test('pencarian status dengan NIR dan email yang cocok', function () {
    $registration = MemberRegistration::factory()->submitted()->create(['email' => 'budi@test.example']);

    $this->from(route('keanggotaan.status'))
        ->post(route('keanggotaan.status.tracking'), [
            'nir' => $registration->nir,
            'email' => 'budi@test.example',
        ])
        ->assertInertia(fn ($page) => $page
            ->component('keanggotaan/status')
            ->where('registration.nir', $registration->nir));
});

test('pencarian status gagal saat email tidak cocok', function () {
    $registration = MemberRegistration::factory()->submitted()->create(['email' => 'budi@test.example']);

    $this->from(route('keanggotaan.status'))
        ->post(route('keanggotaan.status.tracking'), [
            'nir' => $registration->nir,
            'email' => 'salah@example.com',
        ])
        ->assertSessionHasErrors('nir');
});

test('admin dapat menambah kabupaten_kota', function () {
    beAdmin();

    $this->post(route('dashboard.master.kabupaten-kota.store'), ['name' => 'Kabupaten Baru'])
        ->assertRedirect();

    expect(KabupatenKota::where('name', 'Kabupaten Baru')->exists())->toBeTrue();
});

test('nama kabupaten_kota bersifat unik', function () {
    beAdmin();

    KabupatenKota::create(['name' => 'Kota Jambi']);

    $this->post(route('dashboard.master.kabupaten-kota.store'), ['name' => 'Kota Jambi'])
        ->assertSessionHasErrors('name');
});

test('admin dapat memperbarui kabupaten_kota', function () {
    beAdmin();

    $kabupatenKota = KabupatenKota::create(['name' => 'Kota Lama']);

    $this->put(route('dashboard.master.kabupaten-kota.update', $kabupatenKota), ['name' => 'Kota Baru'])
        ->assertRedirect();

    expect($kabupatenKota->fresh()->name)->toBe('Kota Baru');
});

test('kabupaten_kota yang sudah dipakai tidak dapat dihapus', function () {
    beAdmin();

    $kabupatenKota = KabupatenKota::create(['name' => 'Kota Jambi']);
    Instansi::create(['nama' => 'RSUD Test', 'jenis' => 'rumah_sakit', 'kabupaten_kota_id' => $kabupatenKota->id]);

    $this->delete(route('dashboard.master.kabupaten-kota.destroy', $kabupatenKota));

    expect(KabupatenKota::whereKey($kabupatenKota->id)->exists())->toBeTrue();
});

test('kabupaten_kota tanpa pemakaian dapat dihapus', function () {
    beAdmin();

    $kabupatenKota = KabupatenKota::create(['name' => 'Kota Kosong']);

    $this->delete(route('dashboard.master.kabupaten-kota.destroy', $kabupatenKota));

    expect(KabupatenKota::whereKey($kabupatenKota->id)->exists())->toBeFalse();
});

test('admin dapat menambah instansi', function () {
    beAdmin();

    $kabupatenKota = KabupatenKota::create(['name' => 'Kota Jambi']);

    $this->post(route('dashboard.master.instansi.store'), [
        'nama' => 'RSUD Raden Mattaher',
        'jenis' => 'rumah_sakit',
        'kabupaten_kota_id' => $kabupatenKota->id,
    ])->assertRedirect();

    expect(Instansi::where('nama', 'RSUD Raden Mattaher')->exists())->toBeTrue();
});

test('jenis instansi tidak valid ditolak', function () {
    beAdmin();

    $this->post(route('dashboard.master.instansi.store'), [
        'nama' => 'Instansi Aneh',
        'jenis' => 'rumah_ajaib',
    ])->assertSessionHasErrors('jenis');
});

test('admin dapat memperbarui instansi', function () {
    beAdmin();

    $instansi = Instansi::create(['nama' => 'RS Lama', 'jenis' => 'rumah_sakit']);

    $this->put(route('dashboard.master.instansi.update', $instansi), [
        'nama' => 'RS Baru',
        'jenis' => 'klinik',
    ])->assertRedirect();

    $instansi->refresh();

    expect($instansi->nama)->toBe('RS Baru')
        ->and($instansi->jenis)->toBe('klinik');
});

test('instansi yang dipakai registrasi tidak dapat dihapus', function () {
    beAdmin();

    $kabupatenKota = KabupatenKota::create(['name' => 'Kota Jambi']);
    $instansi = Instansi::create(['nama' => 'RSUD Test', 'jenis' => 'rumah_sakit', 'kabupaten_kota_id' => $kabupatenKota->id]);
    MemberRegistration::factory()->submitted()->create([
        'instansi_id' => $instansi->id,
        'kabupaten_kota_id' => $kabupatenKota->id,
    ]);

    $this->delete(route('dashboard.master.instansi.destroy', $instansi));

    expect(Instansi::whereKey($instansi->id)->exists())->toBeTrue();
});

test('instansi tanpa pemakaian dapat dihapus', function () {
    beAdmin();

    $instansi = Instansi::create(['nama' => 'RS Kosong', 'jenis' => 'rumah_sakit']);

    $this->delete(route('dashboard.master.instansi.destroy', $instansi));

    expect(Instansi::whereKey($instansi->id)->exists())->toBeFalse();
});

test('seeder wilayah mengisi 11 kabupaten_kota', function () {
    $this->seed(KabupatenKotaSeeder::class);

    expect(KabupatenKota::count())->toBe(11);
});

test('seeder instansi mengisi starter instansi dengan wilayah', function () {
    $this->seed([KabupatenKotaSeeder::class, InstansiSeeder::class]);

    expect(Instansi::count())->toBe(26)
        ->and(Instansi::whereNull('kabupaten_kota_id')->count())->toBe(0);
});

test('seeder institusi pendidikan mengisi daftar program radiologi', function () {
    $this->seed(EducationCollegeSeeder::class);

    expect(EducationCollege::count())->toBeGreaterThanOrEqual(30)
        ->and(EducationCollege::whereNull('type')->count())->toBe(0)
        ->and(EducationCollege::whereNull('kind')->count())->toBe(0);

    expect(EducationCollege::where('name', 'Poltekkes Kemenkes Semarang')->exists())->toBeTrue()
        ->and(EducationCollege::where('name', 'Akademi Teknik Radiodiagnostik dan Radioterapi (ATRO) Yogyakarta')->exists())->toBeTrue();
});

test('halaman registrasi mengirim daftar institusi pendidikan', function () {
    $this->seed(EducationCollegeSeeder::class);

    $this->get(route('keanggotaan.registrasi'))
        ->assertInertia(fn ($page) => $page
            ->component('keanggotaan/registrasi')
            ->has('educationColleges', EducationCollege::count()));
});
