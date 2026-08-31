<?php

use App\Models\Role;
use App\Support\PermissionCatalog;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function withRoles(): void
{
    foreach (['admin', 'pengurus', 'member'] as $slug) {
        Role::firstOrCreate(
            ['slug' => $slug],
            ['name' => ucfirst($slug), 'permissions' => PermissionCatalog::defaults($slug)],
        );
    }
}

test('tamu dialihkan ke login saat membuka Role & Hak Akses', function () {
    $this->get(route('dashboard.role-management'))
        ->assertRedirect(route('login'));
});

test('member tidak dapat membuka Role & Hak Akses', function () {
    withRoles();
    $member = userWithRole('member');

    $this->actingAs($member)
        ->get(route('dashboard.role-management'))
        ->assertForbidden();
});

test('pengurus tidak dapat membuka Role & Hak Akses', function () {
    withRoles();
    $pengurus = userWithRole('pengurus');

    $this->actingAs($pengurus)
        ->get(route('dashboard.role-management'))
        ->assertForbidden();
});

test('admin dapat melihat daftar role dan katalog fitur', function () {
    withRoles();
    beAdmin();

    $this->get(route('dashboard.role-management'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/role-management')
            ->has('roles', 3)
            ->has('features')
            ->where('roles.0.slug', 'admin')
            ->where('roles.0.permissions', PermissionCatalog::keys()));
});

test('admin dapat memperbarui hak akses sebuah role', function () {
    withRoles();
    beAdmin();

    $role = Role::where('slug', 'member')->firstOrFail();

    $this->put(route('dashboard.role-management.update', $role), [
        'permissions' => ['member-dashboard', 'member-pengaturan'],
    ])->assertRedirect();

    expect($role->fresh()->permissions)->toBe([
        'member-dashboard',
        'member-pengaturan',
    ]);
});

test('permission yang tidak ada di katalog ditolak', function () {
    withRoles();
    beAdmin();

    $role = Role::where('slug', 'member')->firstOrFail();

    $this->put(route('dashboard.role-management.update', $role), [
        'permissions' => ['user-management', 'hack-semua'],
    ])->assertSessionHasErrors('permissions.1');

    expect($role->fresh()->permissions)->toBe(PermissionCatalog::defaults('member'));
});

test('perubahan hak akses langsung berlaku untuk anggota', function () {
    withRoles();
    beAdmin();

    $role = Role::where('slug', 'member')->firstOrFail();
    $this->put(route('dashboard.role-management.update', $role), [
        'permissions' => ['member-pengaturan'],
    ])->assertRedirect();

    $member = userWithRole('member');

    $this->actingAs($member)
        ->get(route('dashboard.kartu-anggota'))
        ->assertForbidden();

    $this->actingAs($member)
        ->get(route('dashboard.change-password'))
        ->assertOk();
});

test('admin tetap superuser meski hak aksesnya dikosongkan', function () {
    withRoles();
    beAdmin();

    $adminRole = Role::where('slug', 'admin')->firstOrFail();

    $this->put(route('dashboard.role-management.update', $adminRole), [
        'permissions' => [],
    ])->assertRedirect();

    expect($adminRole->fresh()->permissions)->toBe([]);

    $this->get(route('dashboard.user-management'))
        ->assertOk();

    $this->get(route('dashboard.role-management'))
        ->assertOk();
});

test('pengurus hanya dapat membuka fitur barcode TTE dan struktur organisasi', function () {
    withRoles();
    $pengurus = userWithRole('pengurus');

    $this->actingAs($pengurus)
        ->get(route('dashboard.barcode-tte'))
        ->assertOk();

    $this->actingAs($pengurus)
        ->get(route('dashboard.struktur-organisasi'))
        ->assertOk();

    $this->actingAs($pengurus)
        ->get(route('dashboard.user-management'))
        ->assertForbidden();

    $this->actingAs($pengurus)
        ->post(route('dashboard.master.instansi.import'))
        ->assertForbidden();
});
