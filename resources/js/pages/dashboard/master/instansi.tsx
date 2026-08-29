import { Head, router, useForm } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    Building2,
    Download,
    Pencil,
    Plus,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/dashboard/data-table';
import ImportCsvModal from '@/components/dashboard/import-csv-modal';
import { Badge } from '@/components/ui/badge';

interface KabupatenKotaOption {
    id: number;
    name: string;
}

interface JenisOption {
    value: string;
    label: string;
}

interface InstansiItem {
    id: number;
    nama: string;
    jenis: string;
    jenis_label: string;
    alamat: string | null;
    telepon: string | null;
    kabupaten_kota_id: number | null;
    kabupaten_kota: string | null;
    is_active: boolean;
}

interface InstansiProps {
    instansi: InstansiItem[];
    kabupatenKota: KabupatenKotaOption[];
    jenisOptions: JenisOption[];
}

const inputClass =
    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200';

function FormModal({
    open,
    onClose,
    item,
    kabupatenKota,
    jenisOptions,
}: {
    open: boolean;
    onClose: () => void;
    item: InstansiItem | null;
    kabupatenKota: KabupatenKotaOption[];
    jenisOptions: JenisOption[];
}) {
    const isEdit = !!item;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama: item?.nama ?? '',
        jenis: item?.jenis ?? 'rumah_sakit',
        alamat: item?.alamat ?? '',
        telepon: item?.telepon ?? '',
        kabupaten_kota_id: item?.kabupaten_kota_id ?? null,
        is_active: item?.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && item) {
            put(`/dashboard/master/instansi/${item.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/dashboard/master/instansi', {
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
                        {isEdit ? 'Edit Instansi' : 'Tambah Instansi'}
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
                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Nama Instansi
                        </label>
                        <input
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            className={inputClass}
                            placeholder="Contoh: RSUD Raden Mattaher Jambi"
                        />
                        {errors.nama && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.nama}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Jenis
                            </label>
                            <select
                                value={data.jenis}
                                onChange={(e) =>
                                    setData('jenis', e.target.value)
                                }
                                className={inputClass}
                            >
                                {jenisOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.jenis && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.jenis}
                                </p>
                            )}
                        </div>
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
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Telepon
                        </label>
                        <input
                            type="text"
                            value={data.telepon}
                            onChange={(e) => setData('telepon', e.target.value)}
                            className={inputClass}
                            placeholder="Contoh: (0741) 123456"
                        />
                        {errors.telepon && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.telepon}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Alamat
                        </label>
                        <textarea
                            value={data.alamat}
                            onChange={(e) => setData('alamat', e.target.value)}
                            rows={2}
                            className={inputClass}
                            placeholder="Alamat instansi (opsional)"
                        />
                        {errors.alamat && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.alamat}
                            </p>
                        )}
                    </div>

                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData('is_active', e.target.checked)
                            }
                            className="size-4 rounded border-neutral-300 text-orange-400 focus:ring-orange-400/20 dark:border-neutral-700"
                        />
                        Aktif (tampil pada form pendaftaran)
                    </label>

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

export default function InstansiPage({
    instansi,
    kabupatenKota,
    jenisOptions,
}: InstansiProps) {
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState<InstansiItem | null>(null);
    const [showImport, setShowImport] = useState(false);

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus instansi ini?')) {
            router.delete(`/dashboard/master/instansi/${id}`);
        }
    };

    const columns: ColumnDef<InstansiItem>[] = [
        {
            accessorKey: 'nama',
            header: 'Nama',
            cell: ({ row }) => (
                <span className="inline-flex items-center gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-400/10 text-orange-400 dark:bg-orange-400/20">
                        <Building2 className="size-4" />
                    </span>
                    <span>{row.original.nama}</span>
                </span>
            ),
        },
        {
            accessorKey: 'jenis_label',
            header: 'Jenis',
            cell: ({ row }) => (
                <Badge
                    variant="outline"
                    className="border-orange-200/70 bg-orange-400/5 text-orange-600 dark:border-orange-400/30 dark:bg-orange-400/10 dark:text-orange-400"
                >
                    {row.original.jenis_label}
                </Badge>
            ),
        },
        {
            accessorKey: 'kabupaten_kota',
            header: 'Wilayah',
            cell: ({ row }) => (
                <span className="text-neutral-600 dark:text-neutral-400">
                    {row.original.kabupaten_kota ?? 'Tanpa wilayah'}
                </span>
            ),
        },
        {
            accessorKey: 'telepon',
            header: 'Telepon',
            cell: ({ row }) => (
                <span className="text-neutral-600 dark:text-neutral-400">
                    {row.original.telepon ?? '—'}
                </span>
            ),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) =>
                row.original.is_active ? (
                    <Badge className="border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        Aktif
                    </Badge>
                ) : (
                    <Badge
                        variant="secondary"
                        className="border-transparent bg-neutral-200/70 text-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-400"
                    >
                        Nonaktif
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
            <Head title="Master Instansi" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                                <Building2 className="size-7 text-orange-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                                    Master Instansi
                                </h1>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Kelola rumah sakit, puskesmas, dan tempat
                                    kerja anggota
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={instansi}
                    title="Daftar Instansi"
                    subtitle={`${instansi.length} instansi terdaftar`}
                    searchPlaceholder="Cari nama, jenis, atau wilayah..."
                    emptyState="Belum ada instansi terdaftar."
                    toolbarActions={
                        <div className="flex flex-wrap items-center gap-2">
                            <a
                                href="/dashboard/master/instansi/template"
                                download
                                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                                <Download className="size-4" />
                                Template
                            </a>
                            <button
                                type="button"
                                onClick={() => setShowImport(true)}
                                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                                <Upload className="size-4" />
                                Import CSV
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditItem(null);
                                    setShowForm(true);
                                }}
                                className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                            >
                                <Plus className="size-4" />
                                Tambah Instansi
                            </button>
                        </div>
                    }
                />
            </div>

            {showImport && (
                <ImportCsvModal
                    open={showImport}
                    onClose={() => setShowImport(false)}
                    action="/dashboard/master/instansi/import"
                    title="Import Instansi"
                    info={
                        <>
                            Unduh <strong>Template</strong> di atas, lalu isi
                            mengikuti baris contoh pada setiap kolom.
                            <br />
                            <br />
                            Format CSV dengan header:{' '}
                            <code className="rounded bg-neutral-200/70 px-1 py-0.5 text-[11px] font-semibold dark:bg-neutral-700">
                                nama;jenis;alamat;telepon;kabupaten_kota;is_active
                            </code>
                            <br />
                            <br />
                            <strong>jenis:</strong> rumah_sakit | puskesmas |
                            klinik | lainnya (boleh ditulis label, mis. "Rumah
                            Sakit")
                            <br />
                            <strong>kabupaten_kota:</strong> nama wilayah; jika
                            belum ada otomatis ditambahkan ke Master Kabupaten /
                            Kota
                            <br />
                            <strong>is_active:</strong> 1 atau 0 (kosong = aktif)
                            <br />
                            Gunakan separator ';'. Baris yang sudah ada (nama +
                            wilayah sama) akan diperbarui.
                        </>
                    }
                />
            )}

            {showForm && (
                <FormModal
                    key={editItem?.id ?? 'new'}
                    open={showForm}
                    onClose={() => {
                        setShowForm(false);
                        setEditItem(null);
                    }}
                    item={editItem}
                    kabupatenKota={kabupatenKota}
                    jenisOptions={jenisOptions}
                />
            )}
        </>
    );
}

InstansiPage.layout = {
    breadcrumbs: [
        {
            title: 'Master Instansi',
            href: '/dashboard/master/instansi',
        },
    ],
};
