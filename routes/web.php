<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QrCodeController;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('kontak', 'kontak')->name('kontak');

Route::prefix('profil')->group(function () {
    Route::inertia('tentang', 'profil/tentang')->name('profil.tentang');
    Route::inertia('visi-misi', 'profil/visi-misi')->name('profil.visi-misi');
    Route::inertia('sejarah', 'profil/sejarah')->name('profil.sejarah');
    Route::inertia('struktur-organisasi', 'profil/struktur-organisasi')->name('profil.struktur-organisasi');
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

Route::get('qr-code/{id}', QrCodeController::class)->name('qr-code');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('dashboard/barcode-tte', function () {
        return inertia('dashboard/barcode-tte', [
            'appUrl' => config('app.url'),
            'memberId' => '1571041103019',
        ]);
    })->name('dashboard.barcode-tte');
});

Route::inertia('verifikasi/{id}', 'verifikasi')->name('verifikasi');

require __DIR__.'/settings.php';
