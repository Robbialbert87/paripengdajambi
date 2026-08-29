<?php

use App\Models\Member;
use App\Models\MemberRegistration;
use App\Models\MemberRegistrationLog;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\AdminSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('RoleSeeder membuat role admin, pengurus, dan member', function () {
    $this->seed(RoleSeeder::class);

    expect(Role::where('slug', 'admin')->exists())->toBeTrue()
        ->and(Role::where('slug', 'pengurus')->exists())->toBeTrue()
        ->and(Role::where('slug', 'member')->exists())->toBeTrue()
        ->and(Role::count())->toBe(3);
});

test('akun admin existing mendapat role admin tanpa mengubah password', function () {
    $adminRole = Role::create(['name' => 'Admin', 'slug' => 'admin']);

    $admin = User::create([
        'name' => 'Admin PARI',
        'email' => 'admin@paripengdajambi.com',
        'password' => 'password-aman',
    ]);
    $originalPassword = $admin->password;

    $this->seed(AdminSeeder::class);

    $admin->refresh();

    expect($admin->role_id)->toBe($adminRole->id)
        ->and($admin->role->is($adminRole))->toBeTrue()
        ->and($admin->password)->toBe($originalPassword)
        ->and(Hash::check('password-aman', $admin->password))->toBeTrue();
});

test('role memiliki relasi users', function () {
    $role = Role::create(['name' => 'Pengurus', 'slug' => 'pengurus']);

    $users = User::factory()->count(2)->create(['role_id' => $role->id]);

    expect($role->users()->count())->toBe(2)
        ->and($users->every(fn (User $user) => $user->role->is($role)))->toBeTrue();
});

test('member dapat terhubung dengan user', function () {
    $user = User::factory()->create();
    $member = Member::factory()->create(['user_id' => $user->id]);

    expect($member->user->is($user))->toBeTrue()
        ->and($user->member->is($member))->toBeTrue();
});

test('member memiliki status dan visibilitas default', function () {
    $member = Member::factory()->create();

    expect($member->membership_status)->toBe('inactive')
        ->and($member->directory_visible)->toBeFalse()
        ->and($member->verified_at)->toBeNull();
});

test('nir member bersifat unik', function () {
    Member::factory()->create(['nir' => '123456789']);

    expect(fn () => Member::factory()->create(['nir' => '123456789']))
        ->toThrow(QueryException::class);
});

test('email member bersifat unik', function () {
    Member::factory()->create(['email' => 'dup@example.com']);

    expect(fn () => Member::factory()->create(['email' => 'dup@example.com']))
        ->toThrow(QueryException::class);
});

test('registrasi dapat dibuat tanpa member aktif', function () {
    $registration = MemberRegistration::factory()->create(['member_id' => null]);

    expect($registration->member_id)->toBeNull()
        ->and($registration->member)->toBeNull();
});

test('registrasi dapat berstatus submitted', function () {
    $registration = MemberRegistration::factory()->submitted()->create();

    expect($registration->status)->toBe('submitted')
        ->and($registration->submitted_at)->not->toBeNull();
});

test('status registrasi memiliki default draft', function () {
    $registration = MemberRegistration::factory()->create();

    expect($registration->status)->toBe('draft');
});

test('log registrasi dapat dibuat dan history tetap tersimpan', function () {
    $registration = MemberRegistration::factory()->create();

    MemberRegistrationLog::factory()->create([
        'registration_id' => $registration->id,
        'status' => 'submitted',
    ]);
    MemberRegistrationLog::factory()->create([
        'registration_id' => $registration->id,
        'status' => 'under_review',
    ]);

    expect($registration->logs()->count())->toBe(2)
        ->and(MemberRegistrationLog::where('registration_id', $registration->id)->count())->toBe(2);
});

test('relationship review dan verifikasi berjalan dengan nama yang jelas', function () {
    $verifier = User::factory()->create();
    $reviewer = User::factory()->create();
    $performer = User::factory()->create();

    $member = Member::factory()->create(['verified_by' => $verifier->id]);
    $registration = MemberRegistration::factory()->create(['reviewed_by' => $reviewer->id]);
    $log = MemberRegistrationLog::factory()->create([
        'registration_id' => $registration->id,
        'performed_by' => $performer->id,
    ]);

    expect($member->verifiedBy->is($verifier))->toBeTrue()
        ->and($verifier->verifiedMembers()->whereKey($member->id)->exists())->toBeTrue()
        ->and($registration->reviewedBy->is($reviewer))->toBeTrue()
        ->and($reviewer->reviewedRegistrations()->whereKey($registration->id)->exists())->toBeTrue()
        ->and($log->performedBy->is($performer))->toBeTrue()
        ->and($performer->performedLogs()->whereKey($log->id)->exists())->toBeTrue();
});

test('foreign key protection berjalan pada log registrasi', function () {
    expect(fn () => MemberRegistrationLog::factory()->create(['registration_id' => 999999]))
        ->toThrow(QueryException::class);
});

test('authentication existing (registrasi Fortify) tetap berfungsi', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
    expect(User::where('email', 'test@example.com')->exists())->toBeTrue();
});
