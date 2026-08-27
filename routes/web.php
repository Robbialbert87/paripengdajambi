<?php

use App\Http\Controllers\StrukturOrganisasiController;
use App\Http\Controllers\TteController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('kontak', 'kontak')->name('kontak');

Route::prefix('profil')->group(function () {
    Route::inertia('tentang', 'profil/tentang')->name('profil.tentang');
    Route::inertia('visi-misi', 'profil/visi-misi')->name('profil.visi-misi');
    Route::inertia('sejarah', 'profil/sejarah')->name('profil.sejarah');
    Route::get('struktur-organisasi', [StrukturOrganisasiController::class, 'show'])->name('profil.struktur-organisasi');
    Route::inertia('pengurus', 'profil/pengurus')->name('profil.pengurus');
    Route::inertia('program-kerja', 'profil/program-kerja')->name('profil.program-kerja');
});

Route::prefix('keanggotaan')->group(function () {
    Route::inertia('registrasi', 'keanggotaan/registrasi')->name('keanggotaan.registrasi');
    Route::inertia('direktori', 'keanggotaan/direktori')->name('keanggotaan.direktori');
    Route::inertia('update-data', 'keanggotaan/update-data')->name('keanggotaan.update-data');
    Route::inertia('status', 'keanggotaan/status')->name('keanggotaan.status');
});

Route::prefix('layanan')->group(function () {
    Route::inertia('iuran', 'layanan/iuran')->name('layanan.iuran');
    Route::inertia('pengajuan-surat', 'layanan/pengajuan-surat')->name('layanan.pengajuan-surat');
    Route::inertia('tracking', 'layanan/tracking')->name('layanan.tracking');
    Route::inertia('download', 'layanan/download')->name('layanan.download');
});

Route::prefix('kegiatan')->group(function () {
    Route::inertia('event', 'kegiatan/event')->name('kegiatan.event');
    Route::inertia('agenda', 'kegiatan/agenda')->name('kegiatan.agenda');
    Route::inertia('galeri', 'kegiatan/galeri')->name('kegiatan.galeri');
});

Route::prefix('informasi')->group(function () {
    Route::inertia('berita', 'informasi/berita')->name('informasi.berita');
    Route::inertia('pengumuman', 'informasi/pengumuman')->name('informasi.pengumuman');
    Route::inertia('edukasi', 'informasi/edukasi')->name('informasi.edukasi');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('dashboard/barcode-tte', [TteController::class, 'index'])->name('dashboard.barcode-tte');
    Route::post('dashboard/barcode-tte', [TteController::class, 'store'])->name('dashboard.barcode-tte.store');
    Route::put('dashboard/barcode-tte/{tteRecord}', [TteController::class, 'update'])->name('dashboard.barcode-tte.update');
    Route::delete('dashboard/barcode-tte/{tteRecord}', [TteController::class, 'destroy'])->name('dashboard.barcode-tte.destroy');
    Route::patch('dashboard/barcode-tte/{tteRecord}/activate', [TteController::class, 'activate'])->name('dashboard.barcode-tte.activate');

    Route::prefix('dashboard/struktur-organisasi')->group(function () {
        Route::get('/', [StrukturOrganisasiController::class, 'index'])->name('dashboard.struktur-organisasi');
        Route::post('/bidang', [StrukturOrganisasiController::class, 'storeBidang'])->name('dashboard.struktur-organisasi.bidang.store');
        Route::put('/bidang/{bidang}', [StrukturOrganisasiController::class, 'updateBidang'])->name('dashboard.struktur-organisasi.bidang.update');
        Route::delete('/bidang/{bidang}', [StrukturOrganisasiController::class, 'destroyBidang'])->name('dashboard.struktur-organisasi.bidang.destroy');
        Route::post('/anggota', [StrukturOrganisasiController::class, 'storeAnggota'])->name('dashboard.struktur-organisasi.anggota.store');
        Route::put('/anggota/{anggota}', [StrukturOrganisasiController::class, 'updateAnggota'])->name('dashboard.struktur-organisasi.anggota.update');
        Route::delete('/anggota/{anggota}', [StrukturOrganisasiController::class, 'destroyAnggota'])->name('dashboard.struktur-organisasi.anggota.destroy');
        Route::post('/kontak', [StrukturOrganisasiController::class, 'storeKontak'])->name('dashboard.struktur-organisasi.kontak.store');
        Route::put('/kontak/{kontak}', [StrukturOrganisasiController::class, 'updateKontak'])->name('dashboard.struktur-organisasi.kontak.update');
        Route::delete('/kontak/{kontak}', [StrukturOrganisasiController::class, 'destroyKontak'])->name('dashboard.struktur-organisasi.kontak.destroy');
    });
});

Route::get('verifikasi/{nomorAnggota}', [TteController::class, 'verify'])->name('verifikasi');

require __DIR__.'/settings.php';
