<?php

use App\Models\Instansi;
use App\Models\KabupatenKota;
use App\Models\Member;
use App\Models\MemberRegistration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

/**
 * @return array{0: Member, 1: MemberRegistration, 2: KabupatenKota, 3: Instansi}
 */
function makeApprovedMemberWithRegistration(array $overrides = []): array
{
    $kabupatenKota = KabupatenKota::create(['name' => 'Kota Jambi Admin']);
    $instansi = Instansi::create([
        'nama' => 'RSUD Admin',
        'jenis' => 'rumah_sakit',
        'kabupaten_kota_id' => $kabupatenKota->id,
    ]);

    $member = Member::factory()->active()->create($overrides);

    $registration = MemberRegistration::factory()->create([
        'member_id' => $member->id,
        'full_name' => $member->full_name,
        'nir' => $member->nir,
        'email' => $member->email,
        'status' => 'approved',
        'instansi_id' => $instansi->id,
        'kabupaten_kota_id' => $kabupatenKota->id,
    ]);

    return [$member, $registration, $kabupatenKota, $instansi];
}

test('tamu dialihkan saat membuka direktori anggota', function () {
    $this->get(route('dashboard.direktori-anggota'))
        ->assertRedirect(route('login'));
});

test('admin melihat semua anggota beserta instansi dan wilayah', function () {
    beAdmin();

    $kabupatenKota = KabupatenKota::create(['name' => 'Kota Jambi Admin']);
    $instansi = Instansi::create([
        'nama' => 'RSUD Admin',
        'jenis' => 'rumah_sakit',
        'kabupaten_kota_id' => $kabupatenKota->id,
    ]);

    $member = Member::factory()->active()->create([
        'full_name' => 'Aan Radiografer',
        'nir' => '1571041103111',
        'email' => 'aan@test.example',
    ]);
    MemberRegistration::factory()->create([
        'member_id' => $member->id,
        'full_name' => 'Aan Radiografer',
        'nir' => '1571041103111',
        'email' => 'aan@test.example',
        'status' => 'approved',
        'instansi_id' => $instansi->id,
        'kabupaten_kota_id' => $kabupatenKota->id,
    ]);

    Member::factory()->create([
        'full_name' => 'Beti Nonaktif',
        'nir' => '1571041103222',
        'email' => 'beti@test.example',
        'membership_status' => 'inactive',
        'directory_visible' => true,
    ]);
    Member::factory()->create([
        'full_name' => 'Citra Suspended',
        'nir' => '1571041103333',
        'email' => 'citra@test.example',
        'membership_status' => 'suspended',
        'directory_visible' => false,
    ]);

    $this->get(route('dashboard.direktori-anggota'))
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/direktori-anggota')
            ->has('members', 3)
            ->where('members.0.full_name', 'Aan Radiografer')
            ->where('members.0.instansi', 'RSUD Admin')
            ->where('members.0.kabupaten_kota', 'Kota Jambi Admin')
            ->where('members.1.membership_status', 'inactive')
            ->where('members.2.membership_status', 'suspended'));
});

test('admin memperbarui data anggota dan registrasi approved', function () {
    beAdmin();

    [$member, $registration, , $instansi] = makeApprovedMemberWithRegistration([
        'full_name' => 'Aan Radiografer',
        'nir' => '1571041103111',
        'email' => 'aan@test.example',
    ]);

    $newKabupaten = KabupatenKota::create(['name' => 'Kabupaten Tanjab Barat']);
    $newInstansi = Instansi::create([
        'nama' => 'Puskesmas Baru',
        'jenis' => 'puskesmas',
        'kabupaten_kota_id' => $newKabupaten->id,
    ]);

    $this->put(route('dashboard.direktori-anggota.update', $member), [
        'full_name' => 'Aan R.',
        'nir' => '1571041103999',
        'email' => 'aan.baru@test.example',
        'phone' => '081299887766',
        'membership_status' => 'suspended',
        'directory_visible' => false,
        'instansi_id' => $newInstansi->id,
        'kabupaten_kota_id' => $newKabupaten->id,
    ])->assertRedirect();

    $member->refresh();

    expect($member)
        ->full_name->toBe('Aan R.')
        ->nir->toBe('1571041103999')
        ->email->toBe('aan.baru@test.example')
        ->phone->toBe('081299887766')
        ->membership_status->toBe('suspended')
        ->directory_visible->toBeFalse();

    expect($registration->fresh())
        ->instansi_id->toBe($newInstansi->id)
        ->kabupaten_kota_id->toBe($newKabupaten->id);
});

test('admin mengganti foto anggota dan menghapus foto lama', function () {
    beAdmin();

    Storage::disk('public')->put('registrasi/foto-lama.webp', 'lama');

    [$member] = makeApprovedMemberWithRegistration([
        'full_name' => 'Aan Radiografer',
        'nir' => '1571041103111',
        'email' => 'aan@test.example',
        'photo' => 'registrasi/foto-lama.webp',
    ]);

    $this->put(route('dashboard.direktori-anggota.update', $member), [
        'full_name' => 'Aan Radiografer',
        'nir' => $member->nir,
        'email' => $member->email,
        'phone' => $member->phone,
        'membership_status' => 'active',
        'directory_visible' => true,
        'photo' => UploadedFile::fake()->image('foto-baru.jpg', 600, 800),
    ])->assertRedirect();

    $member->refresh();

    expect($member->photo)->toMatch('/^registrasi\/.+\.webp$/')
        ->and(Storage::disk('public')->exists($member->photo))->toBeTrue()
        ->and(Storage::disk('public')->exists('registrasi/foto-lama.webp'))->toBeFalse();

    Storage::disk('public')->delete($member->photo);
});

test('NIR yang dipakai anggota lain ditolak saat update', function () {
    beAdmin();

    [$member] = makeApprovedMemberWithRegistration([
        'full_name' => 'Aan Radiografer',
        'nir' => '1571041103111',
        'email' => 'aan@test.example',
    ]);

    Member::factory()->create([
        'nir' => '1571041103444',
        'email' => 'lain@test.example',
    ]);

    $this->put(route('dashboard.direktori-anggota.update', $member), [
        'full_name' => 'Aan Radiografer',
        'nir' => '1571041103444',
        'email' => $member->email,
        'phone' => $member->phone,
        'membership_status' => 'active',
        'directory_visible' => true,
    ])->assertSessionHasErrors('nir');
});

test('admin menghapus anggota beserta foto dan memutus tautan registrasi', function () {
    beAdmin();

    Storage::disk('public')->put('registrasi/foto-hapus.webp', 'hapus');

    [$member, $registration] = makeApprovedMemberWithRegistration([
        'full_name' => 'Aan Radiografer',
        'nir' => '1571041103111',
        'email' => 'aan@test.example',
        'photo' => 'registrasi/foto-hapus.webp',
    ]);

    $this->delete(route('dashboard.direktori-anggota.destroy', $member))
        ->assertRedirect();

    expect(Member::whereKey($member->id)->exists())->toBeFalse()
        ->and(Storage::disk('public')->exists('registrasi/foto-hapus.webp'))->toBeFalse()
        ->and($registration->fresh()->member_id)->toBeNull();
});

test('registrasi yang disetujui tidak muncul di halaman verifikasi', function () {
    beAdmin();

    MemberRegistration::factory()->create(['status' => 'submitted']);
    MemberRegistration::factory()->create(['status' => 'approved']);

    $this->get(route('dashboard.verifikasi'))
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/verifikasi')
            ->has('registrations', 1)
            ->where('registrations.0.status', 'submitted'));
});
