import { Head, router, useForm } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { IdCard, ImagePlus, Pencil, Trash2, UsersRound, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/dashboard/data-table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface KabupatenKotaOption {
    id: number;
    name: string;
}

interface InstansiOption {
    id: number;
    nama: string;
    kabupaten_kota_id: number | null;
}

interface MemberItem {
    id: number;
    member_number: string | null;
    full_name: string;
    nir: string;
    nik: string | null;
    email: string;
    phone: string;
    photo: string | null;
    membership_status: string;
    directory_visible: boolean;
    instansi_id: number | null;
    kabupaten_kota_id: number | null;
    instansi: string | null;
    kabupaten_kota: string | null;
    account?: {
        email: string | null;
        role_slug: string | null;
    } | null;
}

interface DirektoriAnggotaProps {
    members: MemberItem[];
    kabupatenKota: KabupatenKotaOption[];
    instansi: InstansiOption[];
}

const inputClass =
    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200';

const statusOptions = [
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Nonaktif' },
    { value: 'suspended', label: 'Dibekukan' },
];

const statusLabel = (status: string): string =>
    statusOptions.find((option) => option.value === status)?.label ?? status;

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        active: 'border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
        inactive:
            'border-transparent bg-neutral-200/70 text-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-400',
        suspended:
            'border-transparent bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    };

    return (
        <Badge className={styles[status] ?? styles.inactive}>
            {statusLabel(status)}
        </Badge>
    );
}

const roleOptions = [
    { value: 'member', label: 'Member' },
    { value: 'pengurus', label: 'Pengurus' },
    { value: 'admin', label: 'Admin' },
];

const roleLabel = (slug: string | null | undefined): string =>
    roleOptions.find((option) => option.value === slug)?.label ?? '—';

function RoleSelect({ member }: { member: MemberItem }) {
    const [busy, setBusy] = useState(false);

    const assign = (role: string | undefined) => {
        if (!role) {
            return;
        }

        if (
            !confirm(
                `Ubah hak akses "${member.full_name}" menjadi ${roleLabel(
                    role,
                )}?${
                    member.account
                        ? ''
                        : ' Akun login akan dibuat otomatis (password awal: NIR).'
                }`,
            )
        ) {
            return;
        }

        setBusy(true);
        router.post(
            `/dashboard/direktori-anggota/${member.id}/role`,
            { role },
            {
                preserveScroll: true,
                onFinish: () => setBusy(false),
                onError: (errors) =>
                    alert(
                        Object.values(errors)[0] ?? 'Gagal mengubah hak akses.',
                    ),
            },
        );
    };

    return (
        <select
            value={member.account?.role_slug ?? ''}
            disabled={busy}
            onChange={(e) => assign(e.target.value || undefined)}
            className={cn(
                inputClass,
                'w-auto min-w-28 py-1.5 text-xs',
                busy && 'opacity-50',
            )}
        >
            <option value="">{busy ? 'Menyimpan...' : '—'}</option>
            {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

interface MemberFormData {
    full_name: string;
    nir: string;
    nik: string;
    email: string;
    phone: string;
    photo: File | null;
    membership_status: string;
    directory_visible: boolean;
    instansi_id: number | null;
    kabupaten_kota_id: number | null;
}

interface FormModalProps {
    open: boolean;
    onClose: () => void;
    item: MemberItem | null;
    kabupatenKota: KabupatenKotaOption[];
    instansi: InstansiOption[];
}

function FormModal({
    open,
    onClose,
    item,
    kabupatenKota,
    instansi,
}: FormModalProps) {
    const isEdit = !!item;
    const { data, setData, put, processing, errors, reset } =
        useForm<MemberFormData>({
            full_name: item?.full_name ?? '',
            nir: item?.nir ?? '',
            nik: item?.nik ?? '',
            email: item?.email ?? '',
            phone: item?.phone ?? '',
            photo: null,
            membership_status: item?.membership_status ?? 'active',
            directory_visible: item?.directory_visible ?? true,
            instansi_id: item?.instansi_id ?? null,
            kabupaten_kota_id: item?.kabupaten_kota_id ?? null,
        });

    const photoPreview = useMemo(() => {
        if (data.photo instanceof File) {
            return URL.createObjectURL(data.photo);
        }

        return item?.photo ? `/storage/${item.photo}` : null;
    }, [data.photo, item?.photo]);

    const initials = (item?.full_name ?? '?')
        .split(' ')
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && item) {
            put(`/dashboard/direktori-anggota/${item.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-300/60 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900">
                <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-white/10">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                        Edit Anggota
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-indigo-500/10 text-lg font-bold text-indigo-500 dark:bg-indigo-500/20">
                            {photoPreview ? (
                                <img
                                    src={photoPreview}
                                    alt={data.full_name || 'Preview'}
                                    className="size-20 rounded-full object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </div>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-indigo-300 bg-indigo-100 px-4 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-200 dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:text-indigo-500">
                            <ImagePlus className="size-4" />
                            Ganti Foto
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    setData(
                                        'photo',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                            />
                        </label>
                        {errors.photo && (
                            <p className="text-xs text-red-500">
                                {errors.photo}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            value={data.full_name}
                            onChange={(e) =>
                                setData('full_name', e.target.value)
                            }
                            className={inputClass}
                        />
                        {errors.full_name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.full_name}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                NIR
                            </label>
                            <input
                                type="text"
                                value={data.nir}
                                onChange={(e) => setData('nir', e.target.value)}
                                className={inputClass}
                            />
                            {errors.nir && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.nir}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                NIK
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={16}
                                value={data.nik}
                                onChange={(e) => setData('nik', e.target.value)}
                                className={inputClass}
                            />
                            {errors.nik && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.nik}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Nomor Anggota
                        </label>
                        <input
                            type="text"
                            value={item?.member_number ?? '—'}
                            disabled
                            className={cn(inputClass, 'opacity-60')}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Telepon
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.phone && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Kabupaten / Kota
                            </label>
                            <select
                                value={data.kabupaten_kota_id ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'kabupaten_kota_id',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    )
                                }
                                className={inputClass}
                            >
                                <option value="">Pilih wilayah...</option>
                                {kabupatenKota.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                            {errors.kabupaten_kota_id && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.kabupaten_kota_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Instansi / Tempat Kerja
                            </label>
                            <select
                                value={data.instansi_id ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'instansi_id',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    )
                                }
                                className={inputClass}
                            >
                                <option value="">Pilih instansi...</option>
                                {instansi.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.nama}
                                    </option>
                                ))}
                            </select>
                            {errors.instansi_id && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.instansi_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Status Keanggotaan
                            </label>
                            <select
                                value={data.membership_status}
                                onChange={(e) =>
                                    setData('membership_status', e.target.value)
                                }
                                className={inputClass}
                            >
                                {statusOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.membership_status && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.membership_status}
                                </p>
                            )}
                        </div>
                        <div className="flex items-end pb-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                <input
                                    type="checkbox"
                                    checked={data.directory_visible}
                                    onChange={(e) =>
                                        setData(
                                            'directory_visible',
                                            e.target.checked,
                                        )
                                    }
                                    className="size-4 rounded border-neutral-300 text-indigo-500 focus:ring-indigo-500/20 dark:border-neutral-700"
                                />
                                Tampil di Direktori Publik
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function DirektoriAnggota({
    members,
    kabupatenKota,
    instansi,
}: DirektoriAnggotaProps) {
    const [editItem, setEditItem] = useState<MemberItem | null>(null);

    const handleDelete = (id: number) => {
        if (
            confirm(
                'Yakin ingin menghapus anggota ini? Data tidak dapat dikembalikan.',
            )
        ) {
            router.delete(`/dashboard/direktori-anggota/${id}`);
        }
    };

    const columns: ColumnDef<MemberItem>[] = [
        {
            accessorKey: 'member_number',
            header: 'No. Anggota',
            cell: ({ row }) => (
                <span className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
                    {row.original.member_number ?? '—'}
                </span>
            ),
        },
        {
            accessorKey: 'full_name',
            header: 'Nama',
            cell: ({ row }) => {
                const initials = row.original.full_name
                    .split(' ')
                    .slice(0, 2)
                    .map((part) => part.charAt(0))
                    .join('')
                    .toUpperCase();

                return (
                    <span className="inline-flex items-center gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
                        <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-indigo-500/10 text-xs text-indigo-500 dark:bg-indigo-500/20">
                            {row.original.photo ? (
                                <img
                                    src={`/storage/${row.original.photo}`}
                                    alt={row.original.full_name}
                                    className="size-8 object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </span>
                        <span>{row.original.full_name}</span>
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
            accessorKey: 'membership_status',
            header: 'Status',
            cell: ({ row }) => (
                <StatusBadge status={row.original.membership_status} />
            ),
        },
        {
            accessorKey: 'directory_visible',
            header: 'Direktori',
            cell: ({ row }) =>
                row.original.directory_visible ? (
                    <Badge className="border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        Ya
                    </Badge>
                ) : (
                    <Badge
                        variant="secondary"
                        className="border-transparent bg-neutral-200/70 text-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-400"
                    >
                        Tidak
                    </Badge>
                ),
        },
        {
            id: 'account',
            header: 'Hak Akses',
            enableHiding: false,
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex flex-col items-start gap-1">
                    {row.original.account?.email && (
                        <span className="max-w-40 truncate text-[11px] text-neutral-400">
                            {row.original.account.email}
                        </span>
                    )}
                    <RoleSelect member={row.original} />
                </div>
            ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            enableHiding: false,
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => setEditItem(row.original)}
                        className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        title="Edit"
                    >
                        <Pencil className="size-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(row.original.id)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
                        title="Hapus"
                    >
                        <Trash2 className="size-3.5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Direktori Anggota" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 items-center justify-center rounded-full bg-indigo-500/10 dark:bg-indigo-500/20">
                                <UsersRound className="size-7 text-indigo-500" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                                    Direktori Anggota
                                </h1>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Kelola seluruh data anggota yang telah
                                    disetujui
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                            <IdCard className="size-4 text-indigo-500" />
                            {members.length} anggota terdaftar
                        </div>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={members}
                    title="Daftar Anggota"
                    subtitle={`${members.length} anggota ditampilkan`}
                    searchPlaceholder="Cari nama, NIR, nomor anggota, atau instansi..."
                    emptyState="Belum ada anggota yang disetujui."
                />
            </div>

            {editItem && (
                <FormModal
                    key={editItem.id}
                    open
                    onClose={() => setEditItem(null)}
                    item={editItem}
                    kabupatenKota={kabupatenKota}
                    instansi={instansi}
                />
            )}
        </>
    );
}

DirektoriAnggota.layout = {
    breadcrumbs: [
        {
            title: 'Direktori Anggota',
            href: '/dashboard/direktori-anggota',
        },
    ],
};
