import { Link, usePage } from '@inertiajs/react';
import {
    Barcode,
    Building2,
    Calendar,
    ClipboardCheck,
    FileText,
    IdCard,
    LayoutGrid,
    MapPin,
    Settings,
    UserCog,
    Users,
    UsersRound,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { direktoriAnggota, kartuAnggota, roleManagement, verifikasi } from '@/routes/dashboard';
import instansi from '@/routes/dashboard/master/instansi';
import kabupatenKota from '@/routes/dashboard/master/kabupaten-kota';
import type { NavGroup, NavItem } from '@/types';

const ADMIN = 'admin';

const Permission = {
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

type NavItemWithAccess = NavItem & { permission?: string };
type NavGroupWithAccess = Omit<NavGroup, 'items'> & {
    items: NavItemWithAccess[];
    role?: 'member';
};

const dashboardItem: NavItem = {
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutGrid,
};

const navGroups: NavGroupWithAccess[] = [
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

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage().props as {
        auth: {
            user: {
                role?: { slug: string; permissions?: string[] } | null;
            };
        };
    };

    const roleSlug = auth.user?.role?.slug ?? '';
    const rolePermissions = auth.user?.role?.permissions ?? [];

    const can = (permission?: string) =>
        !permission ||
        roleSlug === ADMIN ||
        rolePermissions.includes(permission);

    const visibleGroups = navGroups
        .filter(
            (group) =>
                (!group.role || group.role === roleSlug) &&
                group.items.some((item) => can(item.permission)),
        )
        .map<NavGroup>(({ title, items }) => ({
            title,
            items: items.filter((item) => can(item.permission)),
        }));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain dashboardItem={dashboardItem} groups={visibleGroups} />
            </SidebarContent>

            <SidebarFooter>
                {footerNavItems.length > 0 && (
                    <NavFooter items={footerNavItems} className="mt-auto" />
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}