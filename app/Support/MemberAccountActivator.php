<?php

namespace App\Support;

use App\Models\Member;
use App\Models\Role;
use App\Models\User;

class MemberAccountActivator
{
    /**
     * Ensure a member has a linked, verified user account.
     *
     * For member-role accounts, the login credential is reset to the member NIR
     * and the user is forced to change the password on next login.
     */
    public static function activate(Member $member): User
    {
        $user = User::where('email', $member->email)->orderBy('id')->first();

        if (! $user) {
            $role = Role::where('slug', 'member')->firstOrCreate(
                ['slug' => 'member'],
                ['name' => 'Member', 'permissions' => PermissionCatalog::defaults('member')],
            );

            $user = User::create([
                'name' => $member->full_name,
                'email' => $member->email,
                'password' => $member->nir,
                'email_verified_at' => now(),
                'role_id' => $role->id,
                'is_active' => true,
                'must_change_password' => true,
            ]);
        } else {
            $user->forceFill([
                'email_verified_at' => $user->email_verified_at ?? now(),
                'is_active' => true,
            ])->save();
        }

        if (($user->role_id !== null && $user->role?->slug === 'member')) {
            $user->forceFill([
                'password' => $member->nir,
                'must_change_password' => true,
            ])->save();
        }

        if ($member->user_id !== $user->id) {
            $member->update(['user_id' => $user->id]);
        }

        return $user;
    }

    /**
     * Link a freshly registered user to an existing member profile by email.
     */
    public static function linkMember(User $user): void
    {
        $member = Member::where('email', $user->email)->whereNull('user_id')->first();

        if ($member) {
            $member->update(['user_id' => $user->id]);
        }
    }
}
