<?php

namespace App\Support;

class PermissionCatalog
{
    public const MEMBER_DASHBOARD = 'member-dashboard';

    public const MEMBER_KARTU = 'member-kartu';

    public const MEMBER_DIRETORI = 'member-direktori';

    public const MEMBER_EVENT = 'member-event';

    public const MEMBER_DOKUMEN = 'member-dokumen';

    public const MEMBER_PENGATURAN = 'member-pengaturan';

    public const VERIFIKASI = 'verifikasi-anggota';

    public const DIREKTORI_ANGGOTA = 'direktori-anggota';

    public const BARCODE_TTE = 'barcode-tte';

    public const STRUKTUR_ORGANISASI = 'struktur-organisasi';

    public const USER_MANAGEMENT = 'user-management';

    public const ROLE_MANAGEMENT = 'role-management';

    public const MASTER_DATA = 'master-data';

    /**
     * @return array<string, string>
     */
    public static function all(): array
    {
        return [
            self::MEMBER_DASHBOARD => 'Dashboard Anggota',
            self::MEMBER_KARTU => 'Kartu Anggota',
            self::MEMBER_DIRETORI => 'Direktori Anggota',
            self::MEMBER_EVENT => 'Event & Kegiatan',
            self::MEMBER_DOKUMEN => 'Dokumen',
            self::MEMBER_PENGATURAN => 'Pengaturan Akun',
            self::VERIFIKASI => 'Verifikasi Anggota',
            self::DIREKTORI_ANGGOTA => 'Direktori Anggota (Admin)',
            self::BARCODE_TTE => 'Barcode TTE',
            self::STRUKTUR_ORGANISASI => 'Struktur Organisasi',
            self::USER_MANAGEMENT => 'Manajemen User & Role',
            self::ROLE_MANAGEMENT => 'Role & Hak Akses',
            self::MASTER_DATA => 'Master Data (Kab/Kota & Instansi)',
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function keys(): array
    {
        return array_keys(self::all());
    }

    /**
     * @return array<int, string>
     */
    public static function defaults(string $roleSlug): array
    {
        return match ($roleSlug) {
            'admin' => self::keys(),
            'pengurus' => [self::BARCODE_TTE, self::STRUKTUR_ORGANISASI],
            'member' => [
                self::MEMBER_DASHBOARD,
                self::MEMBER_KARTU,
                self::MEMBER_DIRETORI,
                self::MEMBER_EVENT,
                self::MEMBER_DOKUMEN,
                self::MEMBER_PENGATURAN,
            ],
            default => [],
        };
    }
}
