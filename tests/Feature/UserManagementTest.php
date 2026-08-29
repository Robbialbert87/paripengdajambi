<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function createRoleForUserManagement(string $slug): Role
{
    return Role::create(['name' => ucfirst($slug), 'slug' => $slug]);
}

test('tamu dialihkan ke login saat mengakses manajemen user', function () {
    $this->get(route('dashboard.user-management'))
        ->assertRedirect(route('login'));

    $this->post(route('dashboard.user-management.store'), [
        'name' => 'Tamu Illegal',
        'email' => 'tamu@test.example',
        'role_id' => '1',
    ])->assertRedirect(route('login'));
});

test('member tidak dapat membuka manajemen user', function () {
    $member = userWithRole('member');

    $this->actingAs($member)
        ->get(route('dashboard.user-management'))
        ->assertForbidden();

    $this->actingAs($member)
        ->post(route('dashboard.user-management.store'), [
            'name' => 'Coba',
            'email' => 'coba@test.example',
            'role_id' => '1',
        ])
        ->assertForbidden();
});

test('pengurus tidak dapat membuka manajemen user', function () {
    $pengurus = userWithRole('pengurus');

    $this->actingAs($pengurus)
        ->get(route('dashboard.user-management'))
        ->assertForbidden();
});

test('akun nonaktif tidak dapat membuka manajemen user', function () {
    $adminRole = createRoleForUserManagement('admin');
    $admin = User::factory()->create([
        'role_id' => $adminRole->id,
        'is_active' => false,
    ]);

    $this->actingAs($admin)
        ->get(route('dashboard.user-management'))
        ->assertForbidden();
});

test('admin dapat membuka halaman manajemen user', function () {
    beAdmin();

    $this->get(route('dashboard.user-management'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboard/users')
            ->has('users')
            ->has('roles'));
});

test('admin dapat menambah pengguna dengan role tertentu', function () {
    beAdmin();

    createRoleForUserManagement('member');

    $response = $this->post(route('dashboard.user-management.store'), [
        'name' => 'Budi Anggota',
        'email' => 'budi@test.example',
        'password' => 'password123',
        'role_id' => Role::where('slug', 'member')->value('id'),
    ])->assertRedirect();

    $user = User::where('email', 'budi@test.example')->first();

    expect($user)->not->toBeNull()
        ->and($user->role?->slug)->toBe('member')
        ->and($user->is_active)->toBeTrue()
        ->and($user->email_verified_at)->not->toBeNull();
});

test('admin tidak dapat menambah pengguna dengan email ganda', function () {
    beAdmin();

    $existing = userWithRole('member');

    $this->post(route('dashboard.user-management.store'), [
        'name' => 'Duplikat',
        'email' => $existing->email,
        'password' => 'password123',
        'role_id' => $existing->role_id,
    ])->assertSessionHasErrors('email');
});

test('admin dapat mengubah role dan status pengguna lain', function () {
    $admin = userWithRole('admin');
    $this->actingAs($admin);

    $target = userWithRole('member');
    $pengurusRole = createRoleForUserManagement('pengurus');

    $this->put(route('dashboard.user-management.update', $target), [
        'role_id' => $pengurusRole->id,
        'is_active' => false,
    ])->assertRedirect();

    expect($target->fresh()->role_id)->toBe($pengurusRole->id)
        ->and($target->fresh()->is_active)->toBeFalse();
});

test('admin tidak dapat mengubah role akun sendiri', function () {
    $admin = userWithRole('admin');
    $this->actingAs($admin);

    $pengurusRole = createRoleForUserManagement('pengurus');

    $this->put(route('dashboard.user-management.update', $admin), [
        'role_id' => $pengurusRole->id,
        'is_active' => true,
    ])->assertSessionHasErrors('role_id');

    expect($admin->fresh()->role_id)->toBe($admin->role_id);
});

test('admin tidak dapat menonaktifkan akun sendiri', function () {
    $admin = userWithRole('admin');
    $this->actingAs($admin);

    $this->put(route('dashboard.user-management.update', $admin), [
        'role_id' => $admin->role_id,
        'is_active' => false,
    ])->assertSessionHasErrors('is_active');

    expect($admin->fresh()->is_active)->toBeTrue();
});

test('registrasi publik menetapkan role member', function () {
    createRoleForUserManagement('member');

    $this->post('/register', [
        'name' => 'Citra Pendaftar',
        'email' => 'citra@test.example',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertRedirect(route('dashboard'));

    $user = User::where('email', 'citra@test.example')->first();

    expect($user)->not->toBeNull()
        ->and($user->role?->slug)->toBe('member')
        ->and($user->is_active)->toBeTrue();
});
