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
import type { CSSProperties, ReactNode } from 'react';
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

/* Status → chart tones (neutral shadcn palette) */
const statusColor: Record<string, string> = {
    submitted: 'var(--chart-2)',
    under_review: 'var(--chart-1)',
    revision: 'var(--chart-3)',
    approved: 'var(--chart-5)',
    rejected: 'var(--chart-4)',
    draft: '#9CA3AF',
};

const statusBarColor: Record<string, string> = {
    submitted: 'var(--chart-2)',
    under_review: 'var(--chart-1)',
    revision: 'var(--chart-3)',
    approved: 'var(--chart-5)',
    rejected: 'var(--chart-4)',
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
        <div className="flex h-full flex-1 flex-col gap-6 bg-background p-6">
            <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-[10px] bg-muted">
                    <AppLogoIcon className="h-10 w-auto mix-blend-multiply dark:mix-blend-screen" />
                </div>
                <div>
                    <h2 className="text-2xl leading-tight font-bold text-foreground">
                        Selamat Datang, {member?.full_name ?? auth.user.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Beranda Anggota
                    </p>
                </div>
            </div>

            {member ? (
                <>
                    <div className="flex flex-col gap-4 rounded-[10px] border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-16 items-center justify-center overflow-hidden rounded-[10px] bg-muted text-lg font-bold text-primary">
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
                                    <h3 className="text-lg font-bold text-foreground">
                                        {member.full_name}
                                    </h3>
                                    <MemberStatusBadge
                                        status={member.membership_status}
                                    />
                                </div>
                                <p className="mt-0.5 font-mono text-sm text-muted-foreground">
                                    {member.member_number ?? '—'}
                                </p>
                                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <BadgeCheck className="size-3.5 text-primary" />
                                    Terverifikasi:{' '}
                                    {formatDate(member.verified_at)}
                                </div>
                            </div>
                        </div>
                        <Link
                            href={kartuAnggota()}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary/90"
                        >
                            <IdCard className="size-4" />
                            Lihat Kartu Anggota
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="rounded-[10px] border border-border bg-card p-6">
                        <h3 className="mb-4 text-base font-semibold text-foreground">
                            Profil & Data Keanggotaan
                        </h3>
                        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                            {rows.map((row) => (
                                <div
                                    key={row.label}
                                    className="border-b border-border pb-2"
                                >
                                    <p className="text-xs font-medium text-muted-foreground">
                                        {row.label}
                                    </p>
                                    <p className="mt-0.5 text-sm font-semibold text-foreground">
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
                                className="group flex items-center gap-3 rounded-[10px] border border-border bg-card p-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                            >
                                <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-primary transition-colors group-hover:bg-muted">
                                    <action.icon className="size-5" />
                                </div>
                                <div>
                                    <span className="font-semibold text-foreground">
                                        {action.title}
                                    </span>
                                    <p className="text-xs text-muted-foreground">
                                        {action.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            ) : (
                <div className="rounded-[10px] border border-dashed border-border bg-card p-8 text-center">
                    <Users className="mx-auto size-10 text-primary" />
                    <h3 className="mt-3 text-lg font-bold text-foreground">
                        Data Anggota Belum Tertaut
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Akun Anda belum terhubung ke data anggota. Cek status
                        registrasi Anda dengan NIR, atau hubungi pengurus.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link
                            href="/keanggotaan/status"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary/90"
                        >
                            Status Keanggotaan
                        </Link>
                        <Link
                            href="/keanggotaan/registrasi"
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-muted"
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

function CardHeaderWithLink({
    title,
    action,
}: {
    title: string;
    action?: ReactNode;
}) {
    return (
        <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            {action}
        </div>
    );
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
            iconClass: 'bg-muted text-primary',
            href: canDirektori ? String(direktoriAnggota()) : undefined,
        },
        {
            label: 'Menunggu Verifikasi',
            value: values.pendingVerifikasi,
            icon: ClipboardCheck,
            iconClass: 'bg-muted text-foreground',
            href: canVerifikasi ? String(verifikasi()) : undefined,
        },
        {
            label: 'Instansi Aktif',
            value: values.totalInstansi,
            icon: Building2,
            iconClass: 'bg-muted text-foreground',
            href: canMasterData ? instansi.index.url() : undefined,
        },
        {
            label: 'Total Pengguna',
            value: values.totalPengguna,
            icon: UserCog,
            iconClass: 'bg-muted text-foreground',
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
    const breakdownTotal = breakdown.reduce((sum, item) => sum + item.count, 0);

    const donutStyle: CSSProperties | undefined =
        breakdown.length > 0
            ? ({
                  background: `conic-gradient(${breakdown
                      .map((item, index) => {
                          const accum = breakdown
                              .slice(0, index)
                              .reduce((acc, prev) => acc + prev.percentage, 0);
                          const color = statusColor[item.status] ?? '#9CA3AF';

                          return `${color} ${accum}% ${accum + item.percentage}%`;
                      })
                      .join(', ')})`,
              } as CSSProperties)
            : undefined;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 bg-background p-6">
                <header className="flex flex-col gap-1">
                    <h1 className="text-[26px] leading-7 font-bold text-foreground">
                        Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Ringkasan dan pengelolaan keanggotaan{' '}
                        {new Date().toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                </header>

                <section
                    aria-labelledby="summary-title"
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    <h2 id="summary-title" className="sr-only">
                        Ringkasan
                    </h2>
                    {statCards.map((stat) => (
                        <div
                            key={stat.label}
                            className="flex min-h-[116px] flex-col justify-between rounded-[10px] border border-border bg-card p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {stat.label}
                                    </p>
                                    <p className="mt-1 text-[26px] leading-8 font-bold text-foreground tabular-nums">
                                        {stat.value.toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <div
                                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.iconClass}`}
                                >
                                    <stat.icon className="size-[18px]" />
                                </div>
                            </div>
                            {stat.href && (
                                <Link
                                    href={stat.href}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                >
                                    Lihat Lebih Lengkap
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            )}
                        </div>
                    ))}
                </section>

                <section
                    aria-labelledby="analytics-title"
                    className="grid gap-4 lg:grid-cols-3"
                >
                    <h2 id="analytics-title" className="sr-only">
                        Analitik
                    </h2>

                    <div className="rounded-[10px] border border-border bg-card p-5 lg:col-span-2">
                        <CardHeaderWithLink
                            title="Registrasi per Status"
                            action={
                                canVerifikasi ? (
                                    <Link
                                        href={verifikasi()}
                                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                                    >
                                        Lihat Semua
                                        <ArrowRight className="size-4" />
                                    </Link>
                                ) : undefined
                            }
                        />

                        {breakdown.length > 0 ? (
                            <ul className="flex flex-col gap-5">
                                {breakdown.map((item) => {
                                    const max = Math.max(
                                        ...breakdown.map((b) => b.count),
                                        1,
                                    );
                                    const width = Math.max(
                                        (item.count / max) * 100,
                                        item.count > 0 ? 6 : 0,
                                    );

                                    return (
                                        <li key={item.status}>
                                            <div className="mb-1.5 flex items-center justify-between text-sm">
                                                <span className="font-medium text-foreground">
                                                    {item.label}
                                                </span>
                                                <span className="text-muted-foreground tabular-nums">
                                                    {item.count}{' '}
                                                    <span className="text-xs">
                                                        ({item.percentage}%)
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${width}%`,
                                                        backgroundColor:
                                                            statusBarColor[
                                                                item.status
                                                            ] ??
                                                            'var(--chart-5)',
                                                    }}
                                                />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                                <Inbox className="size-10 text-muted-foreground/40" />
                                <p className="text-sm text-muted-foreground">
                                    Belum ada data verifikasi.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="rounded-[10px] border border-border bg-card p-5">
                        <h3 className="mb-4 text-base font-semibold text-foreground">
                            Status Verifikasi
                        </h3>

                        {breakdown.length > 0 ? (
                            <>
                                <div
                                    className="mx-auto size-36 rounded-full"
                                    style={donutStyle}
                                    role="img"
                                    aria-label="Distribusi status verifikasi"
                                />
                                <p className="mt-3 text-center text-2xl font-bold text-foreground tabular-nums">
                                    {breakdownTotal.toLocaleString('id-ID')}
                                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                                        total registrasi
                                    </span>
                                </p>

                                <ul className="mt-5 space-y-3">
                                    {breakdown.map((item) => (
                                        <li
                                            key={item.status}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <span className="flex items-center gap-2 text-muted-foreground">
                                                <span
                                                    className="size-2.5 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            statusColor[
                                                                item.status
                                                            ] ?? '#9CA3AF',
                                                    }}
                                                />
                                                {item.label}
                                            </span>
                                            <span className="font-semibold text-foreground tabular-nums">
                                                {item.count}
                                                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                                                    {item.percentage}%
                                                </span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                                <Inbox className="size-10 text-muted-foreground/40" />
                                <p className="text-sm text-muted-foreground">
                                    Belum ada data verifikasi.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                <section
                    aria-labelledby="recent-title"
                    className="rounded-[10px] border border-border bg-card p-5"
                >
                    <CardHeaderWithLink
                        title="Registrasi Terbaru"
                        action={
                            canVerifikasi ? (
                                <Link
                                    href={verifikasi()}
                                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                                >
                                    Lihat Semua
                                    <ArrowRight className="size-4" />
                                </Link>
                            ) : undefined
                        }
                    />

                    {recentRegistrations && recentRegistrations.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
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
                                    {recentRegistrations.map((registration) => (
                                        <tr
                                            key={registration.id}
                                            className="border-b border-border last:border-0"
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
                                                    <span className="font-semibold text-foreground">
                                                        {registration.full_name}
                                                    </span>
                                                    <span className="block font-mono text-xs text-muted-foreground">
                                                        {registration.nir}
                                                    </span>
                                                </Link>
                                            </td>
                                            <td className="py-3 pr-4 text-muted-foreground">
                                                {registration.instansi ?? '—'}
                                            </td>
                                            <td className="py-3 pr-4 text-muted-foreground">
                                                {registration.kabupaten_kota ??
                                                    '—'}
                                            </td>
                                            <td className="py-3 pr-4 text-muted-foreground">
                                                {registration.submitted_at ??
                                                    '—'}
                                            </td>
                                            <td className="py-3">
                                                <StatusBadge
                                                    status={registration.status}
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                            <Inbox className="size-10 text-muted-foreground/40" />
                            <p className="text-sm text-muted-foreground">
                                Belum ada registrasi masuk.
                            </p>
                        </div>
                    )}
                </section>

                {visibleActions.length > 0 && (
                    <section
                        aria-labelledby="quick-title"
                        className="rounded-[10px] border border-border bg-card p-5"
                    >
                        <h3
                            id="quick-title"
                            className="mb-4 text-base font-semibold text-foreground"
                        >
                            Akses Cepat
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {visibleActions.map((action) => (
                                <Link
                                    key={action.title}
                                    href={action.href}
                                    className="group flex items-center gap-3 rounded-[10px] border border-border bg-card p-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                                >
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary transition-colors group-hover:bg-muted">
                                        <action.icon className="size-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block truncate font-semibold text-foreground">
                                            {action.title}
                                        </span>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {action.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
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
