<?php

use App\Models\Member;
use App\Models\Role;
use App\Models\User;
use App\Support\MemberAccountActivator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

/**
 * @return array{0: Member, 1: User}
 */
function makeActivatedMember(array $overrides = []): array
{
    $member = Member::factory()->active()->create(array_merge([
        'full_name' => 'Ririn Radiografer',
        'nir' => '1571041104444',
        'email' => 'ririn@test.example',
        'phone' => '081234567899',
    ], $overrides));

    $user = MemberAccountActivator::activate($member);

    return [$member, $user];
}

test('tamu dialihkan ke login saat membuka dashboard dan kartu anggota', function () {
    $this->get(route('dashboard'))
        ->assertRedirect(route('login'));

    $this->get(route('dashboard.kartu-anggota'))
        ->assertRedirect(route('login'));
});

test('member dapat login menggunakan NIR sebagai identifier', function () {
    [$member, $user] = makeActivatedMember();

    $this->post(route('login'), [
        'email' => $member->nir,
        'password' => $member->nir,
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($user);
});

test('member dapat login menggunakan email dengan password awal NIR', function () {
    [$member, $user] = makeActivatedMember();

    $this->post(route('login'), [
        'email' => $member->email,
        'password' => $member->nir,
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($user);
});

test('password awal member adalah NIR dan wajib diganti', function () {
    [$member, $user] = makeActivatedMember();

    expect(Hash::check($member->nir, $user->fresh()->password))->toBeTrue()
        ->and($user->fresh()->must_change_password)->toBeTrue();
});

test('login member ditolak bila password salah', function () {
    [$member] = makeActivatedMember();

    $this->post(route('login'), [
        'email' => $member->nir,
        'password' => 'salah-sandi',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('login ditolak untuk akun nonaktif', function () {
    $user = User::factory()->create([
        'email' => 'off@test.example',
        'password' => 'secret123',
        'is_active' => false,
    ]);

    $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'secret123',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('member dapat membuka kartu anggota', function () {
    $member = userWithRole('member');

    $this->actingAs($member)
        ->get(route('dashboard.kartu-anggota'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboard/anggota/kartu'));
});

test('member tanpa hak member-kartu ditolak mengakses kartu', function () {
    $role = Role::where('slug', 'member')->firstOrCreate(
        ['slug' => 'member'],
        ['name' => 'Member', 'permissions' => []],
    );
    $role->update(['permissions' => []]);

    $member = userWithRole('member');

    $this->actingAs($member)
        ->get(route('dashboard.kartu-anggota'))
        ->assertForbidden();
});

test('member tidak dapat membuka fitur barcode TTE', function () {
    $member = userWithRole('member');

    $this->actingAs($member)
        ->get(route('dashboard.barcode-tte'))
        ->assertForbidden();
});

test('user tanpa role ditolak membuka halaman dashboard berhak akses', function () {
    $user = User::factory()->create(['role_id' => null]);

    $this->actingAs($user)
        ->get(route('dashboard.role-management'))
        ->assertForbidden();

    $this->actingAs($user)
        ->get(route('dashboard.kartu-anggota'))
        ->assertForbidden();
});

test('member yang wajib ganti password dialihkan ke halaman ganti password', function () {
    [$member, $user] = makeActivatedMember();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('dashboard.change-password'));
});

test('member dapat membuka dan mengganti password pertama', function () {
    [$member, $user] = makeActivatedMember();

    $this->actingAs($user)
        ->get(route('dashboard.change-password'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboard/anggota/pengaturan-akun'));

    $this->post(route('dashboard.change-password.update'), [
        'password' => 'password-baru-123',
        'password_confirmation' => 'password-baru-123',
    ])->assertRedirect(route('dashboard'));

    expect($user->fresh()->must_change_password)->toBeFalse()
        ->and(Hash::check('password-baru-123', $user->fresh()->password))->toBeTrue()
        ->and(Hash::check($member->nir, $user->fresh()->password))->toBeFalse();
});

test('setelah ganti password dashboard dapat diakses langsung', function () {
    [$member, $user] = makeActivatedMember();

    $this->actingAs($user)
        ->post(route('dashboard.change-password.update'), [
            'password' => 'password-ganti-1',
            'password_confirmation' => 'password-ganti-1',
        ])->assertRedirect(route('dashboard'));

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk();
});

test('approve registrasi membuat akun login dengan password awal NIR', function () {
    beAdmin();

    $registration = makeRegistrationWithContext();
    $this->post(route('dashboard.verifikasi.process', $registration));
    $this->post(route('dashboard.verifikasi.approve', $registration))->assertRedirect();

    $user = User::where('email', 'siti@test.example')->first();

    expect($user)->not->toBeNull()
        ->and($user->role?->slug)->toBe('member')
        ->and($user->is_active)->toBeTrue()
        ->and($user->email_verified_at)->not->toBeNull()
        ->and($user->must_change_password)->toBeTrue()
        ->and(Hash::check('1571041103020', $user->password))->toBeTrue()
        ->and($user->member?->id)->not->toBeNull();

    auth()->logout();

    $this->post(route('login'), [
        'email' => '1571041103020',
        'password' => '1571041103020',
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($user);
});
