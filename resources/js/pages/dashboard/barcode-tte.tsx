import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useRef, useCallback, useState } from 'react';
import { Download, ExternalLink, Barcode, RefreshCw, Plus, Pencil, Trash2, CheckCircle, XCircle, Clock, X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface TteRecord {
    id: number;
    nama_lengkap: string;
    nomor_anggota: string;
    jabatan: string;
    tahun_mulai: number;
    tahun_selesai: number;
    is_active: boolean;
    status: string;
}

interface BarcodeTteProps {
    records: TteRecord[];
    activeRecord: TteRecord | null;
    appUrl: string;
}

function FormModal({
    open,
    onClose,
    record,
}: {
    open: boolean;
    onClose: () => void;
    record?: TteRecord | null;
}) {
    const isEdit = !!record;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama_lengkap: record?.nama_lengkap || '',
        nomor_anggota: record?.nomor_anggota || '',
        jabatan: record?.jabatan || 'Ketua PARI (Perhimpunan Radiografer Indonesia) Pengda Provinsi Jambi',
        tahun_mulai: record?.tahun_mulai || new Date().getFullYear(),
        tahun_selesai: record?.tahun_selesai || new Date().getFullYear() + 4,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && record) {
            put(`/dashboard/barcode-tte/${record.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/dashboard/barcode-tte', {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-yellow-100/40 bg-white shadow-2xl dark:border-neutral-700/40 dark:bg-neutral-900">
                <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-neutral-700/40">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                        {isEdit ? 'Edit Record TTE' : 'Tambah Record TTE Baru'}
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
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                value={data.nama_lengkap}
                                onChange={(e) => setData('nama_lengkap', e.target.value)}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.nama_lengkap && <p className="mt-1 text-xs text-red-500">{errors.nama_lengkap}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Nomor Anggota / ID
                            </label>
                            <input
                                type="text"
                                value={data.nomor_anggota}
                                onChange={(e) => setData('nomor_anggota', e.target.value)}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                placeholder="Contoh: 1571041103019"
                            />
                            {errors.nomor_anggota && <p className="mt-1 text-xs text-red-500">{errors.nomor_anggota}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Jabatan
                            </label>
                            <input
                                type="text"
                                value={data.jabatan}
                                onChange={(e) => setData('jabatan', e.target.value)}
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                placeholder="Contoh: Ketua PARI Pengda Provinsi Jambi"
                            />
                            {errors.jabatan && <p className="mt-1 text-xs text-red-500">{errors.jabatan}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Tahun Mulai
                                </label>
                                <input
                                    type="number"
                                    value={data.tahun_mulai}
                                    onChange={(e) => setData('tahun_mulai', Number(e.target.value))}
                                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                    min={2000}
                                    max={2100}
                                />
                                {errors.tahun_mulai && <p className="mt-1 text-xs text-red-500">{errors.tahun_mulai}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Tahun Selesai
                                </label>
                                <input
                                    type="number"
                                    value={data.tahun_selesai}
                                    onChange={(e) => setData('tahun_selesai', Number(e.target.value))}
                                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                    min={2000}
                                    max={2100}
                                />
                                {errors.tahun_selesai && <p className="mt-1 text-xs text-red-500">{errors.tahun_selesai}</p>}
                            </div>
                        </div>
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
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function BarcodeTtePage({ records, activeRecord, appUrl }: BarcodeTteProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [key, setKey] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [editRecord, setEditRecord] = useState<TteRecord | null>(null);

    const verificationUrl = activeRecord
        ? `${appUrl}/verifikasi/${activeRecord.nomor_anggota}`
        : '';

    const handleDownload = useCallback(() => {
        const wrapper = canvasRef.current;
        if (!wrapper) return;
        const canvas = wrapper.querySelector('canvas');
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `barcode-tte-${activeRecord?.nomor_anggota || 'unknown'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }, [activeRecord]);

    const handleRegenerate = useCallback(() => {
        setKey((prev) => prev + 1);
    }, []);

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus record ini?')) {
            router.delete(`/dashboard/barcode-tte/${id}`);
        }
    };

    const handleActivate = (id: number) => {
        router.patch(`/dashboard/barcode-tte/${id}/activate`);
    };

    const statusBadge = (status: string) => {
        if (status === 'active') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="size-3" />
                    Aktif & Berlaku
                </span>
            );
        }
        if (status === 'expired') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-bold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    <Clock className="size-3" />
                    Expired
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400">
                <XCircle className="size-3" />
                Tidak Aktif
            </span>
        );
    };

    return (
        <>
            <Head title="Barcode TTE" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="rounded-2xl border border-yellow-100/40 bg-yellow-50/80 p-6 backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-800/80">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                                <Barcode className="size-7 text-orange-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                                    Barcode TTE
                                </h1>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Kelola data dan barcode Tanda Tangan Elektronik
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => { setEditRecord(null); setShowForm(true); }}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                        >
                            <Plus className="size-4" />
                            Tambah Record
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    {/* QR Code Section */}
                    <div className="xl:col-span-1">
                        <div className="sticky top-6 overflow-hidden rounded-2xl border border-yellow-100/40 bg-yellow-50/80 backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-800/80">
                            <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-4 text-center dark:from-orange-500 dark:to-orange-600">
                                <h2 className="text-sm font-bold tracking-wide text-white">
                                    BARCODE TANDA TANGAN ELEKTRONIK
                                </h2>
                                <p className="mt-0.5 text-xs text-white/80">
                                    PARI Pengda Provinsi Jambi
                                </p>
                            </div>

                            <div className="flex flex-col items-center gap-5 px-6 py-8">
                                {activeRecord ? (
                                    <>
                                        <div
                                            ref={canvasRef}
                                            className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-700/40 dark:bg-neutral-800"
                                        >
                                            <QRCodeCanvas
                                                key={key}
                                                value={verificationUrl}
                                                size={320}
                                                level="H"
                                                bgColor="#ffffff"
                                                fgColor="#000000"
                                                includeMargin={false}
                                            />
                                        </div>

                                        <div className="text-center">
                                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                Nomor Anggota
                                            </p>
                                            <p className="mt-0.5 text-lg font-bold text-neutral-800 dark:text-neutral-200">
                                                {activeRecord.nomor_anggota}
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                                {activeRecord.nama_lengkap}
                                            </p>
                                        </div>

                                        <div className="flex w-full flex-col gap-3">
                                            <button
                                                type="button"
                                                onClick={handleDownload}
                                                className="inline-flex w-full items-center justify-center gap-x-2 rounded-xl border border-transparent bg-orange-400 px-4 py-3 text-sm font-bold text-neutral-50 transition duration-300 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                                            >
                                                <Download className="size-4" />
                                                Download PNG
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleRegenerate}
                                                className="inline-flex w-full items-center justify-center gap-x-2 rounded-xl border border-yellow-100/40 bg-white/50 px-4 py-3 text-sm font-bold text-neutral-700 transition duration-300 hover:bg-yellow-100/60 dark:border-neutral-700/40 dark:bg-neutral-700/30 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                            >
                                                <RefreshCw className="size-4" />
                                                Generate Ulang
                                            </button>
                                            <a
                                                href={verificationUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex w-full items-center justify-center gap-x-2 rounded-xl border border-yellow-100/40 bg-white/50 px-4 py-3 text-sm font-bold text-neutral-700 transition duration-300 hover:bg-yellow-100/60 dark:border-neutral-700/40 dark:bg-neutral-700/30 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                            >
                                                <ExternalLink className="size-4" />
                                                Lihat Halaman Verifikasi
                                            </a>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-8 text-center">
                                        <Barcode className="mx-auto size-12 text-neutral-300 dark:text-neutral-600" />
                                        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                                            Belum ada record aktif.
                                        </p>
                                        <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                                            Klik "Tambah Record" untuk membuat barcode baru.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {activeRecord && (
                                <div className="border-t border-yellow-100/40 bg-yellow-100/20 px-6 py-3 text-center dark:border-neutral-700/40 dark:bg-neutral-800/40">
                                    <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                                        {verificationUrl}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Records Table */}
                    <div className="xl:col-span-2">
                        <div className="overflow-hidden rounded-2xl border border-yellow-100/40 bg-yellow-50/80 backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-800/80">
                            <div className="border-b border-yellow-100/40 px-6 py-4 dark:border-neutral-700/40">
                                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                                    Daftar Record TTE
                                </h2>
                                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                    {records.length} record ditemukan
                                </p>
                            </div>

                            {records.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Belum ada record TTE.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-neutral-100 dark:divide-neutral-700/40">
                                    {records.map((record) => (
                                        <div
                                            key={record.id}
                                            className={`px-6 py-4 transition hover:bg-yellow-100/30 dark:hover:bg-neutral-700/20 ${
                                                record.is_active ? 'bg-green-50/50 dark:bg-green-900/10' : ''
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                                            {record.nama_lengkap}
                                                        </h3>
                                                        {statusBadge(record.status)}
                                                    </div>
                                                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                                        ID: {record.nomor_anggota}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                                        {record.jabatan}
                                                    </p>
                                                    <p className="mt-1 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                                                        Masa Berlaku: {record.tahun_mulai} – {record.tahun_selesai}
                                                    </p>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-2">
                                                    {!record.is_active && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleActivate(record.id)}
                                                            className="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100 dark:border-green-800/50 dark:bg-green-900/20 dark:text-green-400"
                                                            title="Set sebagai aktif"
                                                        >
                                                            <CheckCircle className="size-3.5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => { setEditRecord(record); setShowForm(true); }}
                                                        className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </button>
                                                    {!record.is_active && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(record.id)}
                                                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <FormModal
                open={showForm}
                onClose={() => { setShowForm(false); setEditRecord(null); }}
                record={editRecord}
            />
        </>
    );
}

BarcodeTtePage.layout = {
    breadcrumbs: [
        {
            title: 'Barcode TTE',
            href: '/dashboard/barcode-tte',
        },
    ],
};
