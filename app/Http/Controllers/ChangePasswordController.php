<?php

namespace App\Http\Controllers;

use App\Concerns\PasswordValidationRules;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChangePasswordController extends Controller
{
    use PasswordValidationRules;

    public function show(): Response
    {
        return Inertia::render('dashboard/anggota/pengaturan-akun');
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'password' => $this->passwordRules(),
        ]);

        $request->user()->forceFill([
            'password' => $validated['password'],
            'must_change_password' => false,
        ])->save();

        return redirect()->route('dashboard')->with('toast', [
            'type' => 'success',
            'message' => 'Password berhasil diperbarui.',
        ]);
    }
}
