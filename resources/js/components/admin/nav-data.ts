import {
    Barcode,
    Building2,
    Calendar,
    ClipboardCheck,
    FileText,
    IdCard,
    LayoutGrid,
    MapPin,
    ScanLine,
    Settings,
    UserCog,
    Users,
    UsersRound,
} from 'lucide-react';

import type {
    BaseNavItem,
    Href,
    NavGroup,
} from '@/components/admin/sidebar-types';
import { dashboard } from '@/routes';
import {
    direktoriAnggota,
    kartuAnggota,
    roleManagement,
    verifikasi,
} from '@/routes/dashboard';
import instansi from '@/routes/dashboard/master/instansi';
import kabupatenKota from '@/routes/dashboard/master/kabupaten-kota';

export const ADMIN = 'admin';

export const Permission = {
    verifikasi: 'verifikasi-anggota',
    direktoriAnggota: 'direktori-anggota',
    barcodeTte: 'barcode-tte',
    strukturOrganisasi: 'struktur-organisasi',
    userManagement: 'user-management',
    roleManagement: 'role-management',
    masterData: 'master-data',
    memberKartu: 'member-kartu',
    memberDirektori: 'member-direktori',
    memberEvent: 'member-event',
    memberDokumen: 'member-dokumen',
    memberPengaturan: 'member-pengaturan',
} as const;

type NavItemWithAccess = BaseNavItem & {
    href: Href;
    permission?: string;
};

type NavGroupWithAccess = Omit<NavGroup, 'items'> & {
    items: NavItemWithAccess[];
    role?: 'member';
};

export const dashboardItem: NavItemWithAccess = {
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutGrid,
};

export const navGroups: NavGroupWithAccess[] = [
    {
        title: 'Manajemen Anggota',
        items: [
            {
                title: 'Verifikasi Anggota',
                href: verifikasi(),
                icon: ClipboardCheck,
                permission: Permission.verifikasi,
            },
            {
                title: 'Direktori Anggota',
                href: direktoriAnggota(),
                icon: UsersRound,
                permission: Permission.direktoriAnggota,
            },
        ],
    },
    {
        title: 'Layanan & Administrasi',
        items: [
            {
                title: 'Barcode TTE',
                href: '/dashboard/barcode-tte',
                icon: Barcode,
                permission: Permission.barcodeTte,
            },
        ],
    },
    {
        title: 'Organisasi & Kelembagaan',
        items: [
            {
                title: 'Struktur Organisasi',
                href: '/dashboard/struktur-organisasi',
                icon: Users,
                permission: Permission.strukturOrganisasi,
            },
        ],
    },
    {
        title: 'Manajemen User',
        items: [
            {
                title: 'Manajemen User & Role',
                href: '/dashboard/user-management',
                icon: UserCog,
                permission: Permission.userManagement,
            },
            {
                title: 'Role & Hak Akses',
                href: roleManagement(),
                icon: Settings,
                permission: Permission.roleManagement,
            },
        ],
    },
    {
        title: 'Pengaturan Master Data',
        items: [
            {
                title: 'Master Kab/Kota',
                href: kabupatenKota.index.url(),
                icon: MapPin,
                permission: Permission.masterData,
            },
            {
                title: 'Master Instansi',
                href: instansi.index.url(),
                icon: Building2,
                permission: Permission.masterData,
            },
            {
                title: 'Rekap Modality',
                href: '/dashboard/master/rekap-modality',
                icon: ScanLine,
                permission: Permission.masterData,
            },
        ],
    },
    {
        title: 'MEMBER',
        role: 'member',
        items: [
            {
                title: 'Kartu Anggota',
                href: kartuAnggota(),
                icon: IdCard,
                permission: Permission.memberKartu,
            },
            {
                title: 'Direktori Anggota',
                href: '/keanggotaan/direktori',
                icon: UsersRound,
                permission: Permission.memberDirektori,
            },
            {
                title: 'Event & Kegiatan',
                href: '/kegiatan/event',
                icon: Calendar,
                permission: Permission.memberEvent,
            },
            {
                title: 'Dokumen',
                href: '',
                icon: FileText,
                permission: Permission.memberDokumen,
                disabled: true,
            },
            {
                title: 'Pengaturan Akun',
                href: '/dashboard/change-password',
                icon: Settings,
                permission: Permission.memberPengaturan,
            },
        ],
    },
];
