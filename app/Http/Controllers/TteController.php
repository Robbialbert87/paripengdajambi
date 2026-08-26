<?php

namespace App\Http\Controllers;

use App\Models\TteRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TteController extends Controller
{
    public function index()
    {
        $records = TteRecord::latest('tahun_mulai')->get();
        $activeRecord = TteRecord::active()->first();

        return Inertia::render('dashboard/barcode-tte', [
            'records' => $records->map(fn ($r) => [
                'id' => $r->id,
                'nama_lengkap' => $r->nama_lengkap,
                'nomor_anggota' => $r->nomor_anggota,
                'jabatan' => $r->jabatan,
                'tahun_mulai' => $r->tahun_mulai,
                'tahun_selesai' => $r->tahun_selesai,
                'is_active' => $r->is_active,
                'status' => $r->statusLabel(),
            ]),
            'activeRecord' => $activeRecord ? [
                'id' => $activeRecord->id,
                'nama_lengkap' => $activeRecord->nama_lengkap,
                'nomor_anggota' => $activeRecord->nomor_anggota,
                'jabatan' => $activeRecord->jabatan,
                'tahun_mulai' => $activeRecord->tahun_mulai,
                'tahun_selesai' => $activeRecord->tahun_selesai,
            ] : null,
            'appUrl' => config('app.url'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nomor_anggota' => 'required|string|max:255|unique:tte_records,nomor_anggota',
            'jabatan' => 'required|string|max:255',
            'tahun_mulai' => 'required|integer|min:2000|max:2100',
            'tahun_selesai' => 'required|integer|min:2000|max:2100|gte:tahun_mulai',
        ]);

        $record = TteRecord::create($validated);

        return redirect()->back()->with('success', 'Record TTE berhasil ditambahkan.');
    }

    public function update(Request $request, TteRecord $tteRecord)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nomor_anggota' => 'required|string|max:255|unique:tte_records,nomor_anggota,' . $tteRecord->id,
            'jabatan' => 'required|string|max:255',
            'tahun_mulai' => 'required|integer|min:2000|max:2100',
            'tahun_selesai' => 'required|integer|min:2000|max:2100|gte:tahun_mulai',
        ]);

        $tteRecord->update($validated);

        return redirect()->back()->with('success', 'Record TTE berhasil diperbarui.');
    }

    public function destroy(TteRecord $tteRecord)
    {
        $tteRecord->delete();

        return redirect()->back()->with('success', 'Record TTE berhasil dihapus.');
    }

    public function activate(TteRecord $tteRecord)
    {
        TteRecord::query()->update(['is_active' => false]);
        $tteRecord->update(['is_active' => true]);

        return redirect()->back()->with('success', 'Record TTE berhasil diaktifkan.');
    }

    public function verify($nomorAnggota)
    {
        $record = TteRecord::where('nomor_anggota', $nomorAnggota)->latest('tahun_mulai')->first();

        return Inertia::render('verifikasi', [
            'record' => $record ? [
                'nama_lengkap' => $record->nama_lengkap,
                'nomor_anggota' => $record->nomor_anggota,
                'jabatan' => $record->jabatan,
                'tahun_mulai' => $record->tahun_mulai,
                'tahun_selesai' => $record->tahun_selesai,
                'is_active' => $record->is_active,
                'status' => $record->statusLabel(),
            ] : null,
        ]);
    }
}
