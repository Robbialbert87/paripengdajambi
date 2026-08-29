import { Head, router, useForm } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { MapPin, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/dashboard/data-table';
import { Badge } from '@/components/ui/badge';

interface KabupatenKotaItem {
    id: number;
    name: string;
    instansi_count: number;
}

interface KabupatenKotaProps {
    kabupatenKota: KabupatenKotaItem[];
}

const inputClass =
    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200';

function FormModal({
    open,
    onClose,
    item,
}: {
    open: boolean;
    onClose: () => void;
    item: KabupatenKotaItem | null;
}) {
    const isEdit = !!item;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: item?.name ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && item) {
            put(`/dashboard/master/kabupaten-kota/${item.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/dashboard/master/kabupaten-kota', {
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
            <div className="w-full max-w-md rounded-2xl border border-neutral-300/60 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900">
                <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-white/10">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                        {isEdit
                            ? 'Edit Kabupaten / Kota'
                            : 'Tambah Kabupaten / Kota'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="px-6 py-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Nama
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={inputClass}
                            placeholder="Contoh: Kabupaten Batanghari"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex gap-3">
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
                            className="flex-1 rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500 disabled:opacity-50 dark:bg-orange-500 dark:hover:bg-orange-600"
                        >
                            {processing
                                ? 'Menyimpan...'
                                : isEdit
                                  ? 'Simpan Perubahan'
                                  : 'Tambah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function KabupatenKotaPage({
    kabupatenKota,
}: KabupatenKotaProps) {
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState<KabupatenKotaItem | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus wilayah ini?')) {
            router.delete(`/dashboard/master/kabupaten-kota/${id}`);
        }
    };

    const columns: ColumnDef<KabupatenKotaItem>[] = [
        {
            accessorKey: 'name',
            header: 'Nama',
            cell: ({ row }) => (
                <span className="inline-flex items-center gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-400/10 text-orange-400 dark:bg-orange-400/20">
                        <MapPin className="size-4" />
                    </span>
                    <span>{row.original.name}</span>
                </span>
            ),
        },
        {
            accessorKey: 'instansi_count',
            header: 'Jumlah Instansi',
            cell: ({ row }) => (
                <Badge
                    variant="secondary"
                    className="border-transparent bg-orange-400/10 text-orange-500 dark:bg-orange-400/20 dark:text-orange-400"
                >
                    {row.original.instansi_count} instansi
                </Badge>
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
                        onClick={() => {
                            setEditItem(row.original);
                            setShowForm(true);
                        }}
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
            <Head title="Master Kabupaten / Kota" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                                <MapPin className="size-7 text-orange-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                                    Master Kabupaten / Kota
                                </h1>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Kelola wilayah pendaftaran anggota
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={kabupatenKota}
                    title="Daftar Wilayah"
                    subtitle={`${kabupatenKota.length} wilayah terdaftar`}
                    searchPlaceholder="Cari nama wilayah..."
                    emptyState="Belum ada wilayah terdaftar."
                    toolbarActions={
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditItem(null);
                                    setShowForm(true);
                                }}
                                className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                            >
                                <Plus className="size-4" />
                                Tambah Wilayah
                            </button>
                        </div>
                    }
                />
            </div>

            {showForm && (
                <FormModal
                    key={editItem?.id ?? 'new'}
                    open={showForm}
                    onClose={() => {
                        setShowForm(false);
                        setEditItem(null);
                    }}
                    item={editItem}
                />
            )}
        </>
    );
}

KabupatenKotaPage.layout = {
    breadcrumbs: [
        {
            title: 'Master Kabupaten / Kota',
            href: '/dashboard/master/kabupaten-kota',
        },
    ],
};
