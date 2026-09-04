<?php

use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DirektoriController;
use App\Http\Controllers\InstansiController;
use App\Http\Controllers\KabupatenKotaController;
use App\Http\Controllers\MemberAdminController;
use App\Http\Controllers\MemberRegistrationController;
use App\Http\Controllers\RegistrationReviewController;
use App\Http\Controllers\RekapModalityController;
use App\Http\Controllers\RoleManagementController;
use App\Http\Controllers\StrukturOrganisasiController;
use App\Http\Controllers\TteController;
use App\Http\Controllers\UserController;
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
    Route::get('registrasi', [MemberRegistrationController::class, 'create'])->name('keanggotaan.registrasi');
    Route::post('registrasi', [MemberRegistrationController::class, 'store'])->name('keanggotaan.registrasi.store');
    Route::get('status', [MemberRegistrationController::class, 'statusPage'])->name('keanggotaan.status');
    Route::post('status', [MemberRegistrationController::class, 'tracking'])->name('keanggotaan.status.tracking');
    Route::get('direktori', [DirektoriController::class, 'index'])->name('keanggotaan.direktori');
    Route::inertia('update-data', 'keanggotaan/update-data')->name('keanggotaan.update-data');
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

Route::middleware(['auth', 'verified', 'password.changed'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('dashboard/change-password', [ChangePasswordController::class, 'show'])->name('dashboard.change-password');
    Route::post('dashboard/change-password', [ChangePasswordController::class, 'update'])->name('dashboard.change-password.update');
    Route::inertia('dashboard/kartu-anggota', 'dashboard/anggota/kartu')
        ->middleware('permission:member-kartu')
        ->name('dashboard.kartu-anggota');

    Route::prefix('dashboard')->middleware('permission:barcode-tte')->group(function () {
        Route::get('barcode-tte', [TteController::class, 'index'])->name('dashboard.barcode-tte');
        Route::post('barcode-tte', [TteController::class, 'store'])->name('dashboard.barcode-tte.store');
        Route::put('barcode-tte/{tteRecord}', [TteController::class, 'update'])->name('dashboard.barcode-tte.update');
        Route::delete('barcode-tte/{tteRecord}', [TteController::class, 'destroy'])->name('dashboard.barcode-tte.destroy');
        Route::patch('barcode-tte/{tteRecord}/activate', [TteController::class, 'activate'])->name('dashboard.barcode-tte.activate');
    });

    Route::prefix('dashboard/struktur-organisasi')->middleware('permission:struktur-organisasi')->group(function () {
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

    Route::prefix('dashboard/master')->middleware('permission:master-data')->group(function () {
        Route::get('instansi/template', [InstansiController::class, 'downloadTemplate'])->name('dashboard.master.instansi.template');
        Route::post('instansi/import', [InstansiController::class, 'import'])->name('dashboard.master.instansi.import');
        Route::resource('kabupaten-kota', KabupatenKotaController::class)
            ->parameters(['kabupaten-kota' => 'kabupatenKota'])
            ->names('dashboard.master.kabupaten-kota')
            ->except(['show']);
        Route::resource('instansi', InstansiController::class)->names('dashboard.master.instansi')->except(['show']);
        Route::get('rekap-modality', [RekapModalityController::class, 'index'])
            ->name('dashboard.master.modality-rekap');
    });

    Route::prefix('dashboard/verifikasi')->middleware('permission:verifikasi-anggota')->group(function () {
        Route::get('/', [RegistrationReviewController::class, 'index'])->name('dashboard.verifikasi');
        Route::get('/{registration}', [RegistrationReviewController::class, 'show'])->name('dashboard.verifikasi.show');
        Route::post('/{registration}/process', [RegistrationReviewController::class, 'process'])->name('dashboard.verifikasi.process');
        Route::post('/{registration}/approve', [RegistrationReviewController::class, 'approve'])->name('dashboard.verifikasi.approve');
        Route::post('/{registration}/reject', [RegistrationReviewController::class, 'reject'])->name('dashboard.verifikasi.reject');
        Route::post('/{registration}/revision', [RegistrationReviewController::class, 'requestRevision'])->name('dashboard.verifikasi.revision');
    });

    Route::prefix('dashboard/direktori-anggota')->middleware('permission:direktori-anggota')->group(function () {
        Route::get('/', [MemberAdminController::class, 'index'])->name('dashboard.direktori-anggota');
        Route::post('/{member}/role', [MemberAdminController::class, 'storeRole'])->name('dashboard.direktori-anggota.role');
        Route::put('/{member}', [MemberAdminController::class, 'update'])->name('dashboard.direktori-anggota.update');
        Route::delete('/{member}', [MemberAdminController::class, 'destroy'])->name('dashboard.direktori-anggota.destroy');
    });

    Route::prefix('dashboard/user-management')->middleware('permission:user-management')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('dashboard.user-management');
        Route::post('/', [UserController::class, 'store'])->name('dashboard.user-management.store');
        Route::put('/{user}', [UserController::class, 'update'])->name('dashboard.user-management.update');
    });

    Route::prefix('dashboard/role-management')->middleware('permission:role-management')->group(function () {
        Route::get('/', [RoleManagementController::class, 'index'])->name('dashboard.role-management');
        Route::put('/{role}', [RoleManagementController::class, 'update'])->name('dashboard.role-management.update');
    });
});

Route::get('verifikasi/{nomorAnggota}', [TteController::class, 'verify'])->name('verifikasi');

require __DIR__.'/settings.php';
