<?php

use App\Models\Instansi;
use App\Models\KabupatenKota;
use App\Models\Member;
use App\Models\MemberRegistration;
use App\Models\MemberRegistrationLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

uses(RefreshDatabase::class);

function makeRegistrationWithContext(array $overrides = []): MemberRegistration
{
    $kabupatenKota = KabupatenKota::create(['name' => 'Kota Jambi Review']);
    $instansi = Instansi::create([
        'nama' => 'RSUD Review',
        'jenis' => 'rumah_sakit',
        'kabupaten_kota_id' => $kabupatenKota->id,
    ]);

    return MemberRegistration::factory()->submitted()->create(array_merge([
        'full_name' => 'Siti Radiografer',
        'nir' => '1571041103020',
        'email' => 'siti@test.example',
        'instansi_id' => $instansi->id,
        'kabupaten_kota_id' => $kabupatenKota->id,
    ], $overrides));
}

test('tamu dialihkan saat membuka halaman verifikasi', function () {
    $this->get(route('dashboard.verifikasi'))
        ->assertRedirect(route('login'));
});

test('admin dapat melihat daftar registrasi dan jumlah per status', function () {
    beAdmin();

    makeRegistrationWithContext();
    makeRegistrationWithContext(['status' => 'revision']);

    $this->get(route('dashboard.verifikasi'))
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/verifikasi')
            ->has('registrations', 2)
            ->where('counts.submitted', 1)
            ->where('counts.revision', 1));
});

test('admin dapat memfilter verifikasi berdasarkan status', function () {
    beAdmin();

    makeRegistrationWithContext();
    makeRegistrationWithContext(['status' => 'revision']);

    $this->get(route('dashboard.verifikasi', ['status' => 'revision']))
        ->assertInertia(fn ($page) => $page
            ->has('registrations', 1)
            ->where('currentStatus', 'revision'));
});

test('proses memindahkan registrasi ke under_review dan mencatat log', function () {
    beAdmin();

    $registration = makeRegistrationWithContext();

    $this->post(route('dashboard.verifikasi.process', $registration))
        ->assertRedirect(route('dashboard.verifikasi.show', $registration));

    expect($registration->fresh())
        ->status->toBe('under_review')
        ->reviewed_at->not->toBeNull()
        ->reviewed_by->not->toBeNull();

    $log = MemberRegistrationLog::where('registration_id', $registration->id)->firstOrFail();

    expect($log)->status->toBe('under_review')
        ->and($log->performed_by)->not->toBeNull();
});

test('approve memerlukan status under_review', function () {
    beAdmin();

    $registration = makeRegistrationWithContext();

    $this->post(route('dashboard.verifikasi.approve', $registration))
        ->assertStatus(409);

    expect(Member::count())->toBe(0);
});

test('approve membuat member baru dengan nomor anggota dan log', function () {
    beAdmin();

    $registration = makeRegistrationWithContext();
    $this->post(route('dashboard.verifikasi.process', $registration));

    $this->post(route('dashboard.verifikasi.approve', $registration))
        ->assertRedirect(route('dashboard.verifikasi.show', $registration));

    $registration->refresh();

    expect($registration)
        ->status->toBe('approved')
        ->member_id->not->toBeNull();

    $member = Member::findOrFail($registration->member_id);

    expect($member)
        ->nir->toBe('1571041103020')
        ->full_name->toBe('Siti Radiografer')
        ->email->toBe('siti@test.example')
        ->membership_status->toBe('active')
        ->directory_visible->toBeTrue()
        ->verified_at->not->toBeNull()
        ->verified_by->not->toBeNull()
        ->member_number->toMatch('/^PARI-JBI-\d{4}$/');

    $log = MemberRegistrationLog::where('registration_id', $registration->id)
        ->orderByDesc('id')
        ->firstOrFail();

    expect($log)->status->toBe('approved')
        ->and($log->performed_by)->not->toBeNull();
});

test('approve menghasilkan nomor anggota yang unik berurutan', function () {
    beAdmin();

    $first = makeRegistrationWithContext();
    $this->post(route('dashboard.verifikasi.process', $first));
    $this->post(route('dashboard.verifikasi.approve', $first));

    $second = makeRegistrationWithContext([
        'email' => 'dua@test.example',
        'nir' => '1571041103021',
    ]);
    $this->post(route('dashboard.verifikasi.process', $second));
    $this->post(route('dashboard.verifikasi.approve', $second));

    $numbers = Member::orderBy('id')->pluck('member_number')->all();

    expect($numbers)->toBe(['PARI-JBI-0001', 'PARI-JBI-0002']);
});

test('reject memerlukan alasan penolakan', function () {
    beAdmin();

    $registration = makeRegistrationWithContext();

    $this->post(route('dashboard.verifikasi.reject', $registration), [])
        ->assertSessionHasErrors('rejection_reason');
});

test('reject menolak registrasi dan mencatat alasan', function () {
    beAdmin();

    $registration = makeRegistrationWithContext();

    $this->post(route('dashboard.verifikasi.reject', $registration), [
        'rejection_reason' => 'NIR tidak ditemukan pada database nasional.',
    ])->assertRedirect(route('dashboard.verifikasi.show', $registration));

    expect($registration->fresh())
        ->status->toBe('rejected')
        ->rejection_reason->toBe('NIR tidak ditemukan pada database nasional.')
        ->reviewed_by->not->toBeNull();

    $log = MemberRegistrationLog::where('registration_id', $registration->id)
        ->orderByDesc('id')
        ->firstOrFail();

    expect($log)->status->toBe('rejected')
        ->and($log->note)->toContain('NIR tidak ditemukan');
});

test('requestRevision memerlukan catatan', function () {
    beAdmin();

    $registration = makeRegistrationWithContext();

    $this->post(route('dashboard.verifikasi.revision', $registration), [])
        ->assertSessionHasErrors('notes');
});

test('requestRevision meminta perbaikan pada registrasi', function () {
    beAdmin();

    $registration = makeRegistrationWithContext();

    $this->post(route('dashboard.verifikasi.revision', $registration), [
        'notes' => 'Pas foto kurang jelas, mohon unggah ulang.',
    ])->assertRedirect(route('dashboard.verifikasi.show', $registration));

    expect($registration->fresh())
        ->status->toBe('revision')
        ->notes->toBe('Pas foto kurang jelas, mohon unggah ulang.');

    $log = MemberRegistrationLog::where('registration_id', $registration->id)
        ->orderByDesc('id')
        ->firstOrFail();

    expect($log)->status->toBe('revision')
        ->and($log->note)->toContain('Pas foto kurang jelas');
});

test('daftar ulang diizinkan setelah status revision', function () {
    makeRegistrationWithContext(['status' => 'revision']);

    $this->post(route('keanggotaan.registrasi.store'), [
        'full_name' => 'Siti Radiografer',
        'nik' => '1565091407900002',
        'nir' => '1571041103020',
        'email' => 'siti@test.example',
        'phone' => '081234567890',
        'gender' => 'female',
        'blood_type' => 'A',
        'religion' => 'islam',
        'birth_date' => '1992-01-01',
        'home_address' => 'Jl. Kenanga No. 5, Jambi',
        'employment_status' => 'swasta_non_pns',
        'kabupaten_kota_id' => KabupatenKota::value('id'),
        'instansi_id' => Instansi::value('id'),
        'str_number' => 'STR-2024-00999',
        'str_status' => 'seumur_hidup',
        'education_institution' => 'STIKES Contoh Jambi',
        'education_level' => 'd3',
        'diploma_number' => 'DIP-REV-001',
        'graduation_year' => '2018',
        'diploma_file' => UploadedFile::fake()->create('ijazah.pdf', 50, 'application/pdf'),
        'field' => 'radioterapi',
        'modalities' => ['mri', 'ct_scan'],
        'photo' => UploadedFile::fake()->image('foto.jpg', 600, 800),
    ])->assertRedirect();

    expect(MemberRegistration::count())->toBe(2);
});

test('detail verifikasi menampilkan data lengkap dan riwayat log', function () {
    beAdmin();

    $registration = makeRegistrationWithContext();
    $this->post(route('dashboard.verifikasi.process', $registration));

    $this->get(route('dashboard.verifikasi.show', $registration))
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/verifikasi/detail')
            ->where('registration.nir', $registration->nir)
            ->has('registration.logs'));
});

test('direktori hanya menampilkan anggota aktif yang boleh tampil', function () {
    $kabupatenKota = KabupatenKota::create(['name' => 'Kota Jambi Direktori']);
    $instansi = Instansi::create([
        'nama' => 'RSUD Direktori',
        'jenis' => 'rumah_sakit',
        'kabupaten_kota_id' => $kabupatenKota->id,
    ]);

    $active = Member::create([
        'full_name' => 'Aktif Tampil',
        'nir' => '1111111111111',
        'email' => 'aktif@test.example',
        'phone' => '081234567801',
        'membership_status' => 'active',
        'directory_visible' => true,
    ]);
    MemberRegistration::factory()->create([
        'member_id' => $active->id,
        'full_name' => 'Aktif Tampil',
        'nir' => '1111111111111',
        'email' => 'aktif@test.example',
        'status' => 'approved',
        'instansi_id' => $instansi->id,
        'kabupaten_kota_id' => $kabupatenKota->id,
    ]);

    Member::create([
        'full_name' => 'Nonaktif Tidak Tampil',
        'nir' => '2222222222222',
        'email' => 'nonaktif@test.example',
        'phone' => '081234567802',
        'membership_status' => 'inactive',
        'directory_visible' => true,
    ]);
    Member::create([
        'full_name' => 'Sembunyi',
        'nir' => '3333333333333',
        'email' => 'sembunyi@test.example',
        'phone' => '081234567803',
        'membership_status' => 'active',
        'directory_visible' => false,
    ]);

    $this->get(route('keanggotaan.direktori'))
        ->assertInertia(fn ($page) => $page
            ->component('keanggotaan/direktori')
            ->has('members', 1)
            ->where('members.0.full_name', 'Aktif Tampil')
            ->where('members.0.instansi', 'RSUD Direktori')
            ->where('members.0.kabupaten_kota', 'Kota Jambi Direktori'));
});
