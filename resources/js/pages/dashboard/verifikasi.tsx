import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { ClipboardCheck, Eye } from 'lucide-react';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { verifikasi } from '@/routes/dashboard';
import verifikasiActions from '@/routes/dashboard/verifikasi';

interface RegistrationItem {
    id: number;
    full_name: string | null;
    nir: string;
    status: string;
    status_label: string;
    kabupaten_kota: string | null;
    instansi: string | null;
    submitted_at: string | null;
}

interface VerifikasiProps {
    registrations: RegistrationItem[];
    counts: Record<string, number>;
    currentStatus: string;
}

const statusOrder = [
    'draft',
    'submitted',
    'under_review',
    'revision',
    'rejected',
];

export default function Verifikasi({
    registrations,
    counts,
    currentStatus,
}: VerifikasiProps) {
    const totalCount = Object.values(counts).reduce(
        (sum, count) => sum + count,
        0,
    );

    const columns: ColumnDef<RegistrationItem>[] = [
        {
            accessorKey: 'full_name',
            header: 'Nama',
            cell: ({ row }) => {
                const initials = (row.original.full_name ?? '?')
                    .split(' ')
                    .slice(0, 2)
                    .map((part) => part.charAt(0))
                    .join('')
                    .toUpperCase();

                return (
                    <span className="inline-flex items-center gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-400/10 text-xs text-orange-400 dark:bg-orange-400/20">
                            {initials}
                        </span>
                        <span>{row.original.full_name ?? 'Tanpa nama'}</span>
                    </span>
                );
            },
        },
        {
            accessorKey: 'nir',
            header: 'NIR',
            cell: ({ row }) => (
                <span className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
                    {row.original.nir}
                </span>
            ),
        },
        {
            accessorKey: 'kabupaten_kota',
            header: 'Wilayah',
            cell: ({ row }) => (
                <span className="text-neutral-600 dark:text-neutral-400">
                    {row.original.kabupaten_kota ?? '—'}
                </span>
            ),
        },
        {
            accessorKey: 'instansi',
            header: 'Instansi',
            cell: ({ row }) => (
                <span className="text-neutral-600 dark:text-neutral-400">
                    {row.original.instansi ?? '—'}
                </span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <StatusBadge
                    status={row.original.status}
                    label={row.original.status_label}
                />
            ),
        },
        {
            accessorKey: 'submitted_at',
            header: 'Diajukan',
            cell: ({ row }) => (
                <span className="text-neutral-600 dark:text-neutral-400">
                    {row.original.submitted_at ?? '—'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            enableHiding: false,
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={verifikasiActions.show.url({
                            registration: row.original.id,
                        })}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        title="Detail"
                    >
                        <Eye className="size-3.5" />
                        Detail
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Verifikasi Registrasi" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                            <ClipboardCheck className="size-7 text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                                Verifikasi Registrasi
                            </h1>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Tinjau, proses, dan setujui pengajuan
                                keanggotaan
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Link
                        preserveScroll
                        href={verifikasi.url()}
                        className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                            currentStatus === ''
                                ? 'bg-orange-400 text-white'
                                : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}
                    >
                        Semua ({totalCount})
                    </Link>
                    {statusOrder.map((status) => (
                        <Link
                            key={status}
                            preserveScroll
                            href={verifikasi.url({
                                query: { status },
                            })}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                                currentStatus === status
                                    ? 'bg-orange-400 text-white'
                                    : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                            }`}
                        >
                            {statusLabel(status)} ({counts[status] ?? 0})
                        </Link>
                    ))}
                </div>

                <DataTable
                    columns={columns}
                    data={registrations}
                    title="Daftar Pengajuan"
                    subtitle={`${registrations.length} pengajuan ditampilkan`}
                    searchPlaceholder="Cari nama, NIR, atau wilayah..."
                    emptyState="Tidak ada pengajuan pada status ini."
                />
            </div>
        </>
    );
}

const statusLabels: Record<string, string> = {
    draft: 'Draf',
    submitted: 'Diajukan',
    under_review: 'Dalam Review',
    revision: 'Perlu Revisi',
    approved: 'Disetujui',
    rejected: 'Ditolak',
};

function statusLabel(status: string): string {
    return statusLabels[status] ?? status;
}

Verifikasi.layout = {
    breadcrumbs: [
        {
            title: 'Verifikasi Registrasi',
            href: verifikasi.url(),
        },
    ],
};
