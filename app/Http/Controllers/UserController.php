<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::with('role')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->trim();

                $query->where(function ($query) use ($search) {
                    $query
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('role'), function ($query) use ($request) {
                $query->where('role_id', $request->integer('role'));
            })
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role_id', 'is_active', 'email_verified_at']);

        return Inertia::render('dashboard/users', [
            'users' => $users,
            'roles' => Role::orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'max:255', 'lowercase', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role_id' => ['required', 'exists:roles,id'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role_id' => $validated['role_id'],
        ]);

        $user->forceFill(['email_verified_at' => now()])->save();

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Pengguna berhasil ditambahkan.',
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role_id' => ['required', 'exists:roles,id'],
            'is_active' => ['required', 'boolean'],
        ]);

        if ($user->is($request->user())) {
            if ((int) $validated['role_id'] !== $user->role_id) {
                return back()->withErrors([
                    'role_id' => 'Anda tidak dapat mengubah role akun Anda sendiri.',
                ]);
            }

            if ($validated['is_active'] === false) {
                return back()->withErrors([
                    'is_active' => 'Anda tidak dapat menonaktifkan akun Anda sendiri.',
                ]);
            }
        }

        $user->update([
            'role_id' => $validated['role_id'],
            'is_active' => $validated['is_active'],
        ]);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Data pengguna berhasil diperbarui.',
        ]);
    }
}
