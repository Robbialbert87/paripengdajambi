<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Support\PermissionCatalog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RoleManagementController extends Controller
{
    public function index(): Response
    {
        $roles = Role::orderBy('id')->get(['id', 'name', 'slug', 'permissions']);

        return Inertia::render('dashboard/role-management', [
            'roles' => $roles->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'permissions' => array_values(array_intersect($role->permissions ?? [], PermissionCatalog::keys())),
            ]),
            'features' => PermissionCatalog::all(),
        ]);
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'permissions' => ['array'],
            'permissions.*' => [Rule::in(PermissionCatalog::keys())],
        ]);

        $role->update([
            'permissions' => array_values(array_unique($validated['permissions'] ?? [])),
        ]);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Hak akses role '.$role->name.' diperbarui.',
        ]);
    }
}
