import { Head, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Barcode,
    BadgeCheck,
    Calendar,
    ClipboardCheck,
    FileText,
    IdCard,
    Settings,
    Stethoscope,
    UserCog,
    Users,
    UsersRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import { direktoriAnggota, kartuAnggota, verifikasi } from '@/routes/dashboard';

const ADMIN = 'admin';
const MEMBER = 'member';

interface LatestRegistration {
    instansi?: { nama: string } | null;
    kabupaten_kota?: { name: string } | null;
    employment_status: string | null;
    str_number: string | null;
    str_status: string | null;
    str_expiry_date: string | null;
    education_college?: { name: string } | null;
    education_institution: string | null;
    education_level: string | null;
    graduation_year: number | null;
    field: string | null;
}

interface MemberShared {
    member_number: string | null;
    nir: string;
    nik: string | null;
    full_name: string;
    email: string;
    phone: string;
    photo: string | null;
    membership_status: string;
    verified_at: string | null;
    latest_registration?: LatestRegistration | null;
}

const formatDate = (value?: string | null): string =>
    value
        ? new Date(value).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : '—';

const employmentLabel = (status?: string | null): string =>
    ({
        pns: 'PNS',
        bumn: 'BUMN',
        tni: 'TNI',
        polri: 'POLRI',
        swasta_non_pns: 'Swasta / Non PNS',
    })[status ?? ''] ?? '—';

const strStatusLabel = (status?: string | null): string =>
    ({ sementara: 'STR Sementara', seumur_hidup: 'STR Seumur Hidup' })[
        status ?? ''
    ] ?? '—';

const educationLevelLabel = (level?: string | null): string =>
    ({ d3: 'D3', d4: 'D4' })[level ?? ''] ?? '—';

const membershipLabel = (status?: string | null): string =>
    ({ active: 'Aktif', inactive: 'Nonaktif', suspended: 'Dibekukan' })[
        status ?? ''
    ] ?? '—';

function MemberStatusBadge({ status }: { status?: string | null }) {
    const styles: Record<string, string> = {
        active:
            'border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
        inactive:
            'border-transparent bg-neutral-200/70 text-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-400',
        suspended:
            'border-transparent bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    };

    return (
        <Badge className={styles[status ?? ''] ?? styles.inactive}>
            {membershipLabel(status)}
        </Badge>
    );
}

function MemberDashboard() {
    const { auth } = usePage().props as {
        auth: {
            user: {
                name: string;
                email: string;
                must_change_password?: boolean;
                member?: MemberShared | null;
            };
        };
    };

    const member = auth.user.member;
    const registration = member?.latest_registration;

    const initials = (member?.full_name ?? '?')
        .split(' ')
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();

    const rows: Array<{ label: string; value: ReactNode }> = [
        { label: 'NIK', value: member?.nik ? member.nik : '—' },
        { label: 'Email', value: member?.email ? member.email : '—' },
        { label: 'Telepon', value: member?.phone ? member.phone : '—' },
        {
            label: 'Instansi / Tempat Kerja',
            value: registration?.instansi?.nama ?? '—',
        },
        {
            label: 'Wilayah',
            value: registration?.kabupaten_kota?.name ?? '—',
        },
        {
            label: 'Status Pekerjaan',
            value: employmentLabel(registration?.employment_status),
        },
        { label: 'Nomor STR', value: registration?.str_number ?? '—' },
        { label: 'Status STR', value: strStatusLabel(registration?.str_status) },
        {
            label: 'STR Berakhir',
            value: formatDate(registration?.str_expiry_date),
        },
        {
            label: 'Pendidikan',
            value:
                registration?.education_institution ??
                registration?.education_college?.name ??
                '—',
        },
        {
            label: 'Jenjang / Lulusan',
            value:
                registration?.education_level
                    ? `${educationLevelLabel(registration.education_level)}${
                          registration.graduation_year
                              ? ` (${registration.graduation_year})`
                              : ''
                      }`
                    : '—',
        },
        {
            label: 'Bidang',
            value: registration?.field
                ? {
                      radiodiagnostik: 'Radiodiagnostik',
                      radioterapi: 'Radioterapi',
                      intervensi_radiologi: 'Intervensi Radiologi',
                      kedokteran_nuklir: 'Kedokteran Nuklir',
                  }[registration.field]
                : '—',
        },
    ];

    return (
        <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
            <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                        <AppLogoIcon className="h-10 w-auto mix-blend-multiply dark:mix-blend-screen" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                            Selamat Datang, {member?.full_name ?? auth.user.name}
                        </h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Beranda Anggota
                        </p>
                    </div>
                </div>
            </div>

            {member ? (
                <>
                    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/[.075]">
                        <div className="flex items-center gap-4">
                            <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-orange-400/10 text-lg font-bold text-orange-400 dark:bg-orange-400/20">
                                {member.photo ? (
                                    <img
                                        src={`/storage/${member.photo}`}
                                        alt={member.full_name}
                                        className="size-16 object-cover"
                                    />
                                ) : (
                                    initials
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                                        {member.full_name}
                                    </h3>
                                    <MemberStatusBadge
                                        status={member.membership_status}
                                    />
                                </div>
                                <p className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
                                    {member.member_number ?? '—'}
                                </p>
                                <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                                    <BadgeCheck className="size-3.5 text-orange-400" />
                                    Terverifikasi:{' '}
                                    {formatDate(member.verified_at)}
                                </div>
                            </div>
                        </div>
                        <a
                            href={String(kartuAnggota())}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                        >
                            <IdCard className="size-4" />
                            Lihat Kartu Anggota
                            <ArrowRight className="size-4" />
                        </a>
                    </div>

                    <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                        <h3 className="mb-4 text-lg font-bold text-neutral-800 dark:text-neutral-200">
                            Profil & Data Keanggotaan
                        </h3>
                        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                            {rows.map((row) => (
                                <div
                                    key={row.label}
                                    className="border-b border-neutral-300/60 pb-2 dark:border-white/10"
                                >
                                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                        {row.label}
                                    </p>
                                    <p className="mt-0.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                        {row.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {[
                            {
                                title: 'Pengaturan Akun',
                                description: 'Perbarui password Anda',
                                href: '/dashboard/change-password',
                                icon: Settings,
                            },
                            {
                                title: 'Status Keanggotaan',
                                description: 'Lacak registrasi dengan NIR',
                                href: '/keanggotaan/status',
                                icon: ClipboardCheck,
                            },
                        ].map((action) => (
                            <a
                                key={action.title}
                                href={action.href}
                                className="group flex items-center gap-3 rounded-xl border border-neutral-300/60 bg-white/50 p-4 transition-all duration-300 hover:border-orange-400/40 hover:shadow-md hover:shadow-orange-400/10 dark:border-white/10 dark:bg-neutral-700/30 dark:hover:border-orange-400/40"
                            >
                                <div className="flex size-10 items-center justify-center rounded-lg bg-orange-400/10 transition-colors group-hover:bg-orange-400/20 dark:bg-orange-400/20">
                                    <action.icon className="size-5 text-orange-400" />
                                </div>
                                <div>
                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                        {action.title}
                                    </span>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {action.description}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </>
            ) : (
                <div className="rounded-2xl border border-dashed border-neutral-300/70 bg-neutral-100 p-8 text-center dark:border-white/10 dark:bg-white/[.075]">
                    <Users className="mx-auto size-10 text-orange-400" />
                    <h3 className="mt-3 text-lg font-bold text-neutral-800 dark:text-neutral-200">
                        Data Anggota Belum Tertaut
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Akun Anda belum terhubung ke data anggota. Cek status
                        registrasi Anda dengan NIR, atau hubungi pengurus.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <a
                            href="/keanggotaan/status"
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                        >
                            Status Keanggotaan
                        </a>
                        <a
                            href="/keanggotaan/registrasi"
                            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        >
                            Registrasi Anggota
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Dashboard() {
    const { auth } = usePage().props as {
        auth: {
            user: {
                name: string;
                email: string;
                role?: {
                    slug: string;
                    permissions?: string[];
                } | null;
            };
        };
    };

    const roleSlug = auth.user.role?.slug ?? '';
    const rolePermissions = auth.user.role?.permissions ?? [];

    if (roleSlug === MEMBER) {
        return <MemberDashboard />;
    }

    const can = (permission?: string) =>
        roleSlug === ADMIN || (permission ? rolePermissions.includes(permission) : true);

    const stats = [
        {
            label: 'Total Anggota',
            value: '0',
            icon: Users,
            color: 'text-blue-400',
        },
        {
            label: 'Barcode TTE',
            value: '0',
            icon: Barcode,
            color: 'text-orange-400',
        },
        {
            label: 'Event Aktif',
            value: '0',
            icon: Calendar,
            color: 'text-green-400',
        },
        {
            label: 'Dokumen',
            value: '0',
            icon: FileText,
            color: 'text-purple-400',
        },
    ];

    const quickActions: Array<{
        title: string;
        description: string;
        href: string;
        icon: LucideIcon;
        permission?: string;
    }> = [
        {
            title: 'Verifikasi Anggota',
            description: 'Tinjau pendaftaran baru',
            href: String(verifikasi()),
            icon: ClipboardCheck,
            permission: 'verifikasi-anggota',
        },
        {
            title: 'Direktori Anggota',
            description: 'Kelola data anggota',
            href: String(direktoriAnggota()),
            icon: UsersRound,
            permission: 'direktori-anggota',
        },
        {
            title: 'Barcode TTE',
            description: 'Kelola barcode TTE',
            href: '/dashboard/barcode-tte',
            icon: Barcode,
            permission: 'barcode-tte',
        },
        {
            title: 'Manajemen User & Role',
            description: 'Atur akun pengguna',
            href: '/dashboard/user-management',
            icon: UserCog,
            permission: 'user-management',
        },
    ].filter((action) => can(action.permission));

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Welcome Card */}
                <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                            <AppLogoIcon className="h-10 w-auto mix-blend-multiply dark:mix-blend-screen" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                                Selamat Datang, {auth.user.name}
                            </h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {auth.user.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-5 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-orange-400/10 dark:border-white/10 dark:bg-white/[.075]"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                        {stat.label}
                                    </p>
                                    <p className="mt-1 text-3xl font-bold text-neutral-800 dark:text-neutral-200">
                                        {stat.value}
                                    </p>
                                </div>
                                <div
                                    className={`flex size-12 items-center justify-center rounded-xl bg-neutral-200/80 dark:bg-neutral-700/60`}
                                >
                                    <stat.icon
                                        className={`size-6 ${stat.color}`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                    <h3 className="mb-4 text-lg font-bold text-neutral-800 dark:text-neutral-200">
                        Akses Cepat
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {quickActions.map((action) => (
                            <a
                                key={action.title}
                                href={action.href}
                                className="group flex items-center gap-3 rounded-xl border border-neutral-300/60 bg-white/50 p-4 transition-all duration-300 hover:border-orange-400/40 hover:shadow-md hover:shadow-orange-400/10 dark:border-white/10 dark:bg-neutral-700/30 dark:hover:border-orange-400/40"
                            >
                                <div className="flex size-10 items-center justify-center rounded-lg bg-orange-400/10 transition-colors group-hover:bg-orange-400/20 dark:bg-orange-400/20 dark:group-hover:bg-orange-400/30">
                                    <action.icon className="size-5 text-orange-400" />
                                </div>
                                <div>
                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                        {action.title}
                                    </span>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {action.description}
                                    </p>
                                </div>
                            </a>
                        ))}

                        {Array.from({ length: Math.max(0, 3 - quickActions.length) }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-xl border border-dashed border-neutral-300/60 bg-white/20 p-4 opacity-50 dark:border-white/10 dark:bg-neutral-700/20"
                                >
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-400/10 dark:bg-neutral-600/20">
                                        <Stethoscope className="size-5 text-neutral-400" />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-neutral-500 dark:text-neutral-500">
                                            Segera Hadir
                                        </span>
                                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                                            Fitur lainnya
                                        </p>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};