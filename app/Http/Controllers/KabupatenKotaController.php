<?php

namespace App\Http\Controllers;

use App\Models\KabupatenKota;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class KabupatenKotaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard/master/kabupaten-kota', [
            'kabupatenKota' => KabupatenKota::withCount('instansis')
                ->orderBy('name')
                ->get()
                ->map(fn (KabupatenKota $kabupatenKota) => [
                    'id' => $kabupatenKota->id,
                    'name' => $kabupatenKota->name,
                    'instansi_count' => $kabupatenKota->instansis_count,
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('kabupaten_kota', 'name')],
        ]);

        KabupatenKota::create($validated);

        return back()->with('toast', ['type' => 'success', 'message' => 'Kabupaten/Kota berhasil ditambahkan.']);
    }

    public function update(Request $request, KabupatenKota $kabupatenKota): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('kabupaten_kota', 'name')->ignore($kabupatenKota->id)],
        ]);

        $kabupatenKota->update($validated);

        return back()->with('toast', ['type' => 'success', 'message' => 'Kabupaten/Kota berhasil diperbarui.']);
    }

    public function destroy(KabupatenKota $kabupatenKota): RedirectResponse
    {
        if ($kabupatenKota->instansis()->exists() || $kabupatenKota->registrations()->exists()) {
            return back()->with('toast', ['type' => 'error', 'message' => 'Wilayah yang sudah dipakai tidak dapat dihapus.']);
        }

        $kabupatenKota->delete();

        return back()->with('toast', ['type' => 'success', 'message' => 'Kabupaten/Kota berhasil dihapus.']);
    }
}
