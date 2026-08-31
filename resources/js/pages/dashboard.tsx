import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Building2,
    ClipboardCheck,
    IdCard,
    Inbox,
    Settings,
    UserCog,
    Users,
    UsersRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import {
    direktoriAnggota,
    kartuAnggota,
    roleManagement,
    verifikasi,
} from '@/routes/dashboard';
import instansi from '@/routes/dashboard/master/instansi';
import verifikasiRoutes from '@/routes/dashboard/verifikasi';

const ADMIN = 'admin';
const MEMBER = 'member';

const VERIFIKASI_PERMISSION = 'verifikasi-anggota';
const DIREKTORI_PERMISSION = 'direktori-anggota';
const BARCODE_PERMISSION = 'barcode-tte';
const USER_MANAGEMENT_PERMISSION = 'user-management';
const ROLE_MANAGEMENT_PERMISSION = 'role-management';
const MASTER_DATA_PERMISSION = 'master-data';

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

interface VerificationBreakdownItem {
    status: string;
    label: string;
    count: number;
    percentage: number;
}

interface RecentRegistration {
    id: number;
    full_name: string;
    nir: string;
    instansi: string | null;
    kabupaten_kota: string | null;
    status: string;
    submitted_at: string | null;
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

const breakdownBar: Record<string, string> = {
    submitted: 'bg-sky-500',
    under_review: 'bg-amber-500',
    revision: 'bg-violet-500',
    approved: 'bg-emerald-500',
    rejected: 'bg-red-500',
};

const breakdownDot: Record<string, string> = {
    submitted: 'bg-sky-500',
    under_review: 'bg-amber-500',
    revision: 'bg-violet-500',
    approved: 'bg-emerald-500',
    rejected: 'bg-red-500',
};

function MemberStatusBadge({ status }: { status?: string | null }) {
    const styles: Record<string, string> = {
        active: 'border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
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
        {
            label: 'Status STR',
            value: strStatusLabel(registration?.str_status),
        },
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
            value: registration?.education_level
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
        <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-[#f5f7fb] p-6">
            <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-full bg-[#1e84c4]/10 dark:bg-[#1e84c4]/20">
                    <AppLogoIcon className="h-10 w-auto mix-blend-multiply dark:mix-blend-screen" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[#313b5e]">
                        Selamat Datang, {member?.full_name ?? auth.user.name}
                    </h2>
                    <p className="text-sm text-[#5d7186]">Beranda Anggota</p>
                </div>
            </div>

            {member ? (
                <>
                    <div className="flex flex-col gap-4 rounded-[0.25rem] border border-neutral-300/60 bg-white p-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/[.03]">
                        <div className="flex items-center gap-4">
                            <div className="flex size-16 items-center justify-center overflow-hidden rounded-[0.25rem] bg-[#1e84c4]/10 text-lg font-bold text-[#1e84c4] dark:bg-[#1e84c4]/20 dark:text-[#6ec4f0]">
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
                                    <h3 className="text-lg font-bold text-[#313b5e]">
                                        {member.full_name}
                                    </h3>
                                    <MemberStatusBadge
                                        status={member.membership_status}
                                    />
                                </div>
                                <p className="font-mono text-sm text-[#5d7186]">
                                    {member.member_number ?? '—'}
                                </p>
                                <div className="mt-1 flex items-center gap-1.5 text-xs text-[#5d7186]">
                                    <BadgeCheck className="size-3.5 text-[#1e84c4]" />
                                    Terverifikasi:{' '}
                                    {formatDate(member.verified_at)}
                                </div>
                            </div>
                        </div>
                        <Link
                            href={kartuAnggota()}
                            className="inline-flex items-center gap-2 rounded-[0.25rem] bg-[#1e84c4] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1373ad] dark:hover:bg-[#1373ad]"
                        >
                            <IdCard className="size-4" />
                            Lihat Kartu Anggota
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="rounded-[0.25rem] border border-neutral-300/60 bg-white p-6 dark:border-white/10 dark:bg-white/[.03]">
                        <h3 className="mb-4 text-lg font-bold text-[#313b5e]">
                            Profil & Data Keanggotaan
                        </h3>
                        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                            {rows.map((row) => (
                                <div
                                    key={row.label}
                                    className="border-b border-neutral-300/60 pb-2 dark:border-white/10"
                                >
                                    <p className="text-xs font-medium text-[#5d7186]">
                                        {row.label}
                                    </p>
                                    <p className="mt-0.5 text-sm font-semibold text-[#313b5e]">
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
                            <Link
                                key={action.title}
                                href={action.href}
                                className="group flex items-center gap-3 rounded-[0.25rem] border border-neutral-300/60 bg-neutral-100 p-4 transition-all duration-300 hover:border-[#1e84c4]/40 hover:shadow-md hover:shadow-[#1e84c4]/10 dark:border-white/10 dark:bg-white/[.075] dark:hover:border-[#1e84c4]/40"
                            >
                                <div className="flex size-10 items-center justify-center rounded-[0.25rem] bg-[#1e84c4]/10 transition-colors group-hover:bg-[#1e84c4]/20 dark:bg-[#1e84c4]/20">
                                    <action.icon className="size-5 text-[#1e84c4]" />
                                </div>
                                <div>
                                    <span className="font-semibold text-[#313b5e]">
                                        {action.title}
                                    </span>
                                    <p className="text-xs text-[#5d7186]">
                                        {action.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            ) : (
                <div className="rounded-[0.25rem] border border-dashed border-neutral-300/70 bg-white p-8 text-center dark:border-white/10 dark:bg-white/[.03]">
                    <Users className="mx-auto size-10 text-[#1e84c4]" />
                    <h3 className="mt-3 text-lg font-bold text-[#313b5e]">
                        Data Anggota Belum Tertaut
                    </h3>
                    <p className="mt-1 text-sm text-[#5d7186]">
                        Akun Anda belum terhubung ke data anggota. Cek status
                        registrasi Anda dengan NIR, atau hubungi pengurus.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link
                            href="/keanggotaan/status"
                            className="inline-flex items-center gap-2 rounded-[0.25rem] bg-[#1e84c4] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1373ad] dark:hover:bg-[#1373ad]"
                        >
                            Status Keanggotaan
                        </Link>
                        <Link
                            href="/keanggotaan/registrasi"
                            className="inline-flex items-center gap-2 rounded-[0.25rem] border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        >
                            Registrasi Anggota
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

interface StatCard {
    label: string;
    value: number;
    icon: LucideIcon;
    iconClass: string;
    href?: string;
}

function AdminDashboard() {
    const { auth, stats, verificationBreakdown, recentRegistrations } =
        usePage().props as {
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
            stats?: {
                totalAnggota: number;
                pendingVerifikasi: number;
                totalInstansi: number;
                totalPengguna: number;
            };
            verificationBreakdown?: VerificationBreakdownItem[];
            recentRegistrations?: RecentRegistration[];
        };

    const roleSlug = auth.user.role?.slug ?? '';
    const rolePermissions = auth.user.role?.permissions ?? [];

    const can = (permission: string) =>
        roleSlug === ADMIN || rolePermissions.includes(permission);

    const canVerifikasi = can(VERIFIKASI_PERMISSION);
    const canDirektori = can(DIREKTORI_PERMISSION);
    const canBarcode = can(BARCODE_PERMISSION);
    const canUserManagement = can(USER_MANAGEMENT_PERMISSION);
    const canRoleManagement = can(ROLE_MANAGEMENT_PERMISSION);
    const canMasterData = can(MASTER_DATA_PERMISSION);

    const values = stats ?? {
        totalAnggota: 0,
        pendingVerifikasi: 0,
        totalInstansi: 0,
        totalPengguna: 0,
    };

    const statCards: StatCard[] = [
        {
            label: 'Total Anggota',
            value: values.totalAnggota,
            icon: Users,
            iconClass:
                'bg-[#1e84c4]/10 text-[#1e84c4] dark:bg-[#1e84c4]/20 dark:text-[#6ec4f0]',
            href: canDirektori ? String(direktoriAnggota()) : undefined,
        },
        {
            label: 'Menunggu Verifikasi',
            value: values.pendingVerifikasi,
            icon: ClipboardCheck,
            iconClass:
                'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
            href: canVerifikasi ? String(verifikasi()) : undefined,
        },
        {
            label: 'Instansi Aktif',
            value: values.totalInstansi,
            icon: Building2,
            iconClass:
                'bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400',
            href: canMasterData ? instansi.index.url() : undefined,
        },
        {
            label: 'Total Pengguna',
            value: values.totalPengguna,
            icon: UserCog,
            iconClass:
                'bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400',
            href:
                canUserManagement || canRoleManagement
                    ? '/dashboard/user-management'
                    : undefined,
        },
    ];

    const quickActions: Array<{
        title: string;
        description: string;
        href: string;
        icon: LucideIcon;
    }> = [
        {
            title: 'Verifikasi Anggota',
            description: 'Tinjau pendaftaran baru',
            href: String(verifikasi()),
            icon: ClipboardCheck,
        },
        {
            title: 'Direktori Anggota',
            description: 'Kelola data anggota',
            href: String(direktoriAnggota()),
            icon: UsersRound,
        },
        {
            title: 'Barcode TTE',
            description: 'Kelola barcode TTE',
            href: '/dashboard/barcode-tte',
            icon: IdCard,
        },
        {
            title: 'Role & Hak Akses',
            description: 'Atur izin pengguna',
            href: String(roleManagement()),
            icon: UserCog,
        },
    ];

    const visibleActions = quickActions.filter((action) => {
        const permissionByTitle: Record<string, boolean> = {
            'Verifikasi Anggota': canVerifikasi,
            'Direktori Anggota': canDirektori,
            'Barcode TTE': canBarcode,
            'Role & Hak Akses': canRoleManagement,
        };

        return permissionByTitle[action.title] ?? false;
    });

    const breakdown = verificationBreakdown ?? [];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-[#f5f7fb] p-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#313b5e]">
                        Selamat Datang, {auth.user.name}
                    </h1>
                    <p className="mt-0.5 text-sm text-[#5d7186]">
                        Ringkasan dan pengelolaan keanggotaan{' '}
                        {new Date().toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <div
                            key={stat.label}
                            className="flex flex-col gap-4 rounded-[0.25rem] border border-neutral-300/60 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:shadow-[#1e84c4]/10 dark:border-white/10 dark:bg-white/[.03]"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[#5d7186]">
                                        {stat.label}
                                    </p>
                                    <p className="mt-1 text-3xl font-bold text-[#313b5e] tabular-nums">
                                        {stat.value.toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <div
                                    className={`flex size-12 items-center justify-center rounded-[0.25rem] ${stat.iconClass}`}
                                >
                                    <stat.icon className="size-6" />
                                </div>
                            </div>
                            {stat.href && (
                                <Link
                                    href={stat.href}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e84c4] hover:underline dark:text-[#6ec4f0]"
                                >
                                    Lihat Lebih Lengkap
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-[0.25rem] border border-neutral-300/60 bg-white p-6 lg:col-span-2 dark:border-white/10 dark:bg-white/[.03]">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[#313b5e]">
                                Registrasi Terbaru
                            </h3>
                            {canVerifikasi && (
                                <Link
                                    href={verifikasi()}
                                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#1e84c4] hover:underline dark:text-[#6ec4f0]"
                                >
                                    Lihat Semua
                                    <ArrowRight className="size-4" />
                                </Link>
                            )}
                        </div>

                        {recentRegistrations &&
                        recentRegistrations.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-neutral-200 text-xs tracking-wide text-neutral-500 uppercase dark:border-neutral-800 dark:text-neutral-400">
                                            <th className="pr-4 pb-2 font-medium">
                                                Anggota
                                            </th>
                                            <th className="pr-4 pb-2 font-medium">
                                                Instansi
                                            </th>
                                            <th className="pr-4 pb-2 font-medium">
                                                Kab/Kota
                                            </th>
                                            <th className="pr-4 pb-2 font-medium">
                                                Tanggal
                                            </th>
                                            <th className="pb-2 font-medium">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentRegistrations.map(
                                            (registration) => (
                                                <tr
                                                    key={registration.id}
                                                    className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                                                >
                                                    <td className="py-3 pr-4">
                                                        <Link
                                                            href={
                                                                verifikasiRoutes.show(
                                                                    registration.id,
                                                                ).url
                                                            }
                                                            className="block hover:underline"
                                                        >
                                                            <span className="font-semibold text-[#313b5e]">
                                                                {
                                                                    registration.full_name
                                                                }
                                                            </span>
                                                            <span className="block font-mono text-xs text-[#5d7186]">
                                                                {
                                                                    registration.nir
                                                                }
                                                            </span>
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 pr-4 text-[#5d7186]">
                                                        {registration.instansi ??
                                                            '—'}
                                                    </td>
                                                    <td className="py-3 pr-4 text-[#5d7186]">
                                                        {registration.kabupaten_kota ??
                                                            '—'}
                                                    </td>
                                                    <td className="py-3 pr-4 text-[#5d7186]">
                                                        {registration.submitted_at ??
                                                            '—'}
                                                    </td>
                                                    <td className="py-3">
                                                        <StatusBadge
                                                            status={
                                                                registration.status
                                                            }
                                                            label={
                                                                breakdown.find(
                                                                    (item) =>
                                                                        item.status ===
                                                                        registration.status,
                                                                )?.label ??
                                                                registration.status
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                                <Inbox className="size-10 text-neutral-300 dark:text-neutral-600" />
                                <p className="text-sm text-[#5d7186]">
                                    Belum ada registrasi masuk.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="rounded-[0.25rem] border border-neutral-300/60 bg-white p-6 dark:border-white/10 dark:bg-white/[.03]">
                        <h3 className="mb-4 text-lg font-bold text-[#313b5e]">
                            Status Verifikasi
                        </h3>

                        {breakdown.length > 0 ? (
                            <>
                                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                                    {breakdown.map((item) => (
                                        <div
                                            key={item.status}
                                            className={
                                                breakdownBar[item.status]
                                            }
                                            style={{
                                                width: `${item.percentage}%`,
                                            }}
                                        />
                                    ))}
                                </div>

                                <ul className="mt-5 space-y-3">
                                    {breakdown.map((item) => (
                                        <li
                                            key={item.status}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <span className="flex items-center gap-2 text-[#5d7186]">
                                                <span
                                                    className={`size-2.5 rounded-full ${breakdownDot[item.status]}`}
                                                />
                                                {item.label}
                                            </span>
                                            <span className="font-semibold text-[#313b5e] tabular-nums">
                                                {item.count}
                                                <span className="ml-1.5 text-xs font-normal text-[#5d7186]">
                                                    {item.percentage}%
                                                </span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                                <Inbox className="size-10 text-neutral-300 dark:text-neutral-600" />
                                <p className="text-sm text-[#5d7186]">
                                    Belum ada data verifikasi.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {visibleActions.length > 0 && (
                    <div className="rounded-[0.25rem] border border-neutral-300/60 bg-white p-6 dark:border-white/10 dark:bg-white/[.03]">
                        <h3 className="mb-4 text-lg font-bold text-[#313b5e]">
                            Akses Cepat
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {visibleActions.map((action) => (
                                <Link
                                    key={action.title}
                                    href={action.href}
                                    className="group flex items-center gap-3 rounded-[0.25rem] border border-neutral-200 bg-neutral-100 p-4 transition-all duration-300 hover:border-[#1e84c4]/40 hover:shadow-md hover:shadow-[#1e84c4]/10 dark:border-neutral-800 dark:bg-white/[.075] dark:hover:border-[#1e84c4]/40"
                                >
                                    <div className="flex size-10 items-center justify-center rounded-[0.25rem] bg-[#1e84c4]/10 transition-colors group-hover:bg-[#1e84c4]/20 dark:bg-[#1e84c4]/20">
                                        <action.icon className="size-5 text-[#1e84c4]" />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-[#313b5e]">
                                            {action.title}
                                        </span>
                                        <p className="text-xs text-[#5d7186]">
                                            {action.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
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

    if (auth.user.role?.slug === MEMBER) {
        return <MemberDashboard />;
    }

    return <AdminDashboard />;
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
