import { Head } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Building2, ScanLine } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/dashboard/data-table';
import { Badge } from '@/components/ui/badge';

interface OptionItem {
    value: string;
    label: string;
}

interface InstansiItem {
    id: number | null;
    nama: string;
    wilayah: string;
    modalities: string[];
    modality_labels: string[];
    modality_search: string;
    jumlah_modalities: number;
}

interface ModalityRekapProps {
    instansi: InstansiItem[];
    modalityOptions: OptionItem[];
    wilayahOptions: string[];
}

const selectClass =
    'h-9 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200';

export default function ModalityRekap({
    instansi,
    modalityOptions,
    wilayahOptions,
}: ModalityRekapProps) {
    const [selectedModality, setSelectedModality] = useState('');
    const [selectedWilayah, setSelectedWilayah] = useState('');

    const filteredItems = useMemo(() => {
        return instansi.filter((item) => {
            if (
                selectedModality &&
                !item.modalities.includes(selectedModality)
            ) {
                return false;
            }

            if (selectedWilayah && item.wilayah !== selectedWilayah) {
                return false;
            }

            return true;
        });
    }, [instansi, selectedModality, selectedWilayah]);

    const columns: ColumnDef<InstansiItem>[] = [
        {
            accessorKey: 'nama',
            header: 'Instansi',
            cell: ({ row }) => (
                <span className="inline-flex items-center gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20">
                        <Building2 className="size-4" />
                    </span>
                    <span>{row.original.nama}</span>
                </span>
            ),
        },
        {
            accessorKey: 'wilayah',
            header: 'Wilayah',
            cell: ({ row }) => (
                <span className="text-neutral-600 dark:text-neutral-400">
                    {row.original.wilayah}
                </span>
            ),
        },
        {
            accessorKey: 'modality_search',
            header: 'Modality',
            cell: ({ row }) => (
                <div className="flex max-w-md flex-wrap items-center gap-1.5">
                    {row.original.modality_labels.map((label) => (
                        <Badge
                            key={label}
                            variant="outline"
                            className="border-indigo-300/70 bg-indigo-500/5 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-500"
                        >
                            {label}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: 'jumlah_modalities',
            header: 'Jumlah',
            cell: ({ row }) => (
                <Badge className="border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    {row.original.jumlah_modalities} alat
                </Badge>
            ),
        },
    ];

    return (
        <>
            <Head title="Rekap Modality" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-full bg-indigo-500/10 dark:bg-indigo-500/20">
                            <ScanLine className="size-7 text-indigo-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                                Rekap Modality
                            </h1>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Jenis alat yang digunakan tiap instansi
                                berdasarkan anggota terverifikasi
                            </p>
                        </div>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredItems}
                    title="Daftar Instansi"
                    subtitle={`${filteredItems.length} instansi`}
                    searchPlaceholder="Cari nama instansi, wilayah, atau modality..."
                    emptyState="Belum ada instansi dengan modality terverifikasi."
                    toolbarActions={
                        <div className="flex flex-wrap items-center gap-2">
                            <select
                                value={selectedModality}
                                onChange={(e) =>
                                    setSelectedModality(e.target.value)
                                }
                                className={selectClass}
                            >
                                <option value="">Semua Modality</option>
                                {modalityOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedWilayah}
                                onChange={(e) =>
                                    setSelectedWilayah(e.target.value)
                                }
                                className={selectClass}
                            >
                                <option value="">Semua Wilayah</option>
                                {wilayahOptions.map((wilayah) => (
                                    <option key={wilayah} value={wilayah}>
                                        {wilayah}
                                    </option>
                                ))}
                            </select>
                        </div>
                    }
                />
            </div>
        </>
    );
}

ModalityRekap.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Master Data',
            href: '/dashboard/master/instansi',
        },
        {
            title: 'Rekap Modality',
            href: '/dashboard/master/rekap-modality',
        },
    ],
};
