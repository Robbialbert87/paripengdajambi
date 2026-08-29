import { Head, router, useForm } from '@inertiajs/react';
import {
    Building2,
    Camera,
    ChevronRight,
    Pencil,
    Phone,
    Plus,
    Trash2,
    Upload,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    strukturIconMap,
    strukturIconLabels
    
} from '@/lib/struktur-icons';
import type {StrukturIconKey} from '@/lib/struktur-icons';
import { cn } from '@/lib/utils';

/* ─── Types & Constants ────────────────────────────────────────────────────── */

interface Person {
    id: number;
    nama: string;
    inisial: string;
    kategori: string;
    bidang_id: number | null;
    foto: string | null;
    foto_url: string | null;
    sort_order: number;
}

interface Bidang {
    id: number;
    nama: string;
    icon_key: string;
    sort_order: number;
    ketua: Person | null;
    anggota: Person[];
}

interface Kontak {
    id: number;
    nama: string;
    telepon: string;
    sort_order: number;
}

interface StrukturOrganisasiProps {
    pembinas: Person[];
    chairman: Person | null;
    bidangs: Bidang[];
    kontaks: Kontak[];
    icons: StrukturIconKey[];
}

const KATEGORI_LABELS: Record<string, string> = {
    pembina_penasihat: 'Pembina / Penasihat',
    ketua_umum: 'Ketua Umum',
    ketua_bidang: 'Ketua Bidang',
    anggota: 'Anggota',
};

const KATEGORI_OPTIONS = [
    { value: 'pembina_penasihat', label: 'Pembina / Penasihat' },
    { value: 'ketua_umum', label: 'Ketua Umum' },
    { value: 'ketua_bidang', label: 'Ketua Bidang' },
    { value: 'anggota', label: 'Anggota' },
];

/* ─── Shared UI ────────────────────────────────────────────────────────────── */

const inputClass =
    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200';

function ActionButton({
    title,
    onClick,
    className,
    children,
}: {
    title: string;
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition',
                className,
            )}
        >
            {children}
        </button>
    );
}

function PersonAvatar({
    person,
    size = 'size-10 text-xs',
}: {
    person: Person;
    size?: string;
}) {
    return (
        <div
            className={cn(
                'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-orange-500 font-bold text-white shadow-md dark:from-orange-500 dark:to-orange-600',
                size,
            )}
        >
            {person.foto_url ? (
                <img
                    src={person.foto_url}
                    alt={person.nama}
                    loading="lazy"
                    className="h-full w-full object-cover"
                />
            ) : (
                <span>{person.inisial}</span>
            )}
        </div>
    );
}

function KategoriBadge({ kategori }: { kategori: string }) {
    return (
        <span className="inline-flex rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            {KATEGORI_LABELS[kategori] ?? kategori}
        </span>
    );
}

function PhotoUpload({
    fotoUrl,
    foto,
    hapusFoto,
    onSelect,
    onRemove,
}: {
    fotoUrl: string | null;
    foto: File | null;
    hapusFoto: boolean;
    onSelect: (file: File) => void;
    onRemove: () => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const previewSrc = useMemo(() => (foto ? URL.createObjectURL(foto) : null), [foto]);

    useEffect(() => () => {
        if (previewSrc) {
            URL.revokeObjectURL(previewSrc);
        }
    }, [previewSrc]);

    const src = previewSrc ?? (hapusFoto ? null : fotoUrl);

    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Foto (opsional)
            </label>
            <div className="flex items-center gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-900/30">
                    {src ? (
                        <img
                            src={src}
                            alt="Preview Foto"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <Camera className="size-6 text-orange-400" />
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 transition hover:bg-orange-100 dark:border-orange-800/50 dark:bg-orange-900/20 dark:text-orange-400"
                    >
                        <Upload className="size-3.5" />
                        Pilih Gambar
                    </button>
                    {(src || foto) && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
                        >
                            <Trash2 className="size-3.5" />
                            Hapus Foto
                        </button>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file) {
onSelect(file);
}
                        }}
                    />
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                        JPG / PNG / GIF / WebP, maks 5 MB. Otomatis dikonversi
                        ke WebP tanpa pengurangan kualitas.
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ─── Modals ───────────────────────────────────────────────────────────────── */

function ModalShell({
    title,
    onClose,
    children,
}: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-300/60 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900">
                <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-white/10">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function AnggotaModal({
    open,
    initialKategori,
    initialBidangId,
    person,
    bidangs,
    onClose,
}: {
    open: boolean;
    initialKategori: string;
    initialBidangId: number | null;
    person: Person | null;
    bidangs: Bidang[];
    onClose: () => void;
}) {
    const isEdit = !!person;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama: person?.nama ?? '',
        inisial: person?.inisial ?? '',
        kategori: person?.kategori ?? initialKategori,
        bidang_id: person?.bidang_id ?? initialBidangId,
        foto: null as File | null,
        hapus_foto: false,
    });

    const needsBidang =
        data.kategori === 'ketua_bidang' || data.kategori === 'anggota';

    const handleKategoriChange = (val: string) => {
        setData('kategori', val);

        if (val !== 'ketua_bidang' && val !== 'anggota') {
            setData('bidang_id', null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (needsBidang && !data.bidang_id) {
            return;
        }

        if (isEdit && person) {
            put(`/dashboard/struktur-organisasi/anggota/${person.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/dashboard/struktur-organisasi/anggota', {
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
        <ModalShell
            title={isEdit ? 'Edit Anggota' : 'Tambah Anggota'}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Nama Lengkap
                    </label>
                    <input
                        type="text"
                        value={data.nama}
                        onChange={(e) => setData('nama', e.target.value)}
                        className={inputClass}
                        placeholder="Contoh: Alen Rizaldi, AMR., S.KM"
                    />
                    {errors.nama && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.nama}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Inisial (2-3 huruf untuk avatar)
                    </label>
                    <input
                        type="text"
                        maxLength={10}
                        value={data.inisial}
                        onChange={(e) =>
                            setData('inisial', e.target.value.toUpperCase())
                        }
                        className={cn(inputClass, 'max-w-[120px] uppercase')}
                        placeholder="AR"
                    />
                    {errors.inisial && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.inisial}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Kategori
                    </label>
                    <select
                        value={data.kategori}
                        onChange={(e) => handleKategoriChange(e.target.value)}
                        className={inputClass}
                    >
                        {KATEGORI_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {errors.kategori && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.kategori}
                        </p>
                    )}
                </div>

                {needsBidang && (
                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Bidang
                        </label>
                        <select
                            value={data.bidang_id ?? ''}
                            onChange={(e) =>
                                setData(
                                    'bidang_id',
                                    e.target.value
                                        ? Number(e.target.value)
                                        : null,
                                )
                            }
                            className={inputClass}
                        >
                            <option value="">Pilih bidang...</option>
                            {bidangs.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.nama}
                                </option>
                            ))}
                        </select>
                        {errors.bidang_id && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.bidang_id}
                            </p>
                        )}
                        {needsBidang && !data.bidang_id && (
                            <p className="mt-1 text-xs text-red-400">
                                Bidang wajib diisi untuk anggota ini.
                            </p>
                        )}
                    </div>
                )}

                <PhotoUpload
                    fotoUrl={person?.foto_url ?? null}
                    foto={data.foto}
                    hapusFoto={data.hapus_foto}
                    onSelect={(file) => {
                        setData('foto', file);
                        setData('hapus_foto', false);
                    }}
                    onRemove={() => {
                        setData('foto', null);
                        setData('hapus_foto', true);
                    }}
                />
                {errors.foto && (
                    <p className="mt-1 text-xs text-red-500">{errors.foto}</p>
                )}

                <div className="flex gap-3 pt-2">
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
                              : 'Tambah Anggota'}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}

function BidangModal({
    open,
    bidang,
    icons,
    onClose,
}: {
    open: boolean;
    bidang: Bidang | null;
    icons: StrukturIconKey[];
    onClose: () => void;
}) {
    const isEdit = !!bidang;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama: bidang?.nama ?? '',
        icon_key: bidang?.icon_key ?? icons[0],
        sort_order: bidang?.sort_order ?? 0,
    });

    const SelectedIcon = strukturIconMap[data.icon_key as StrukturIconKey];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && bidang) {
            put(`/dashboard/struktur-organisasi/bidang/${bidang.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/dashboard/struktur-organisasi/bidang', {
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
        <ModalShell
            title={isEdit ? 'Edit Bidang' : 'Tambah Bidang'}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Nama Bidang
                    </label>
                    <input
                        type="text"
                        value={data.nama}
                        onChange={(e) => setData('nama', e.target.value)}
                        className={inputClass}
                        placeholder="Contoh: Bid. Sekretariat"
                    />
                    {errors.nama && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.nama}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Ikon
                    </label>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            {SelectedIcon && (
                                <SelectedIcon className="size-5 text-orange-500 dark:text-orange-400" />
                            )}
                        </div>
                        <select
                            value={data.icon_key}
                            onChange={(e) =>
                                setData('icon_key', e.target.value)
                            }
                            className={inputClass}
                        >
                            {icons.map((key) => (
                                <option key={key} value={key}>
                                    {strukturIconLabels[key] ?? key}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.icon_key && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.icon_key}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Urutan Tampil
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={data.sort_order}
                        onChange={(e) =>
                            setData('sort_order', Number(e.target.value))
                        }
                        className={cn(inputClass, 'max-w-[140px]')}
                    />
                    {errors.sort_order && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.sort_order}
                        </p>
                    )}
                </div>

                <div className="flex gap-3 pt-2">
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
                              : 'Tambah Bidang'}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}

function KontakModal({
    open,
    kontak,
    onClose,
}: {
    open: boolean;
    kontak: Kontak | null;
    onClose: () => void;
}) {
    const isEdit = !!kontak;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama: kontak?.nama ?? '',
        telepon: kontak?.telepon ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && kontak) {
            put(`/dashboard/struktur-organisasi/kontak/${kontak.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/dashboard/struktur-organisasi/kontak', {
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
        <ModalShell
            title={isEdit ? 'Edit Kontak' : 'Tambah Kontak'}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Nama
                    </label>
                    <input
                        type="text"
                        value={data.nama}
                        onChange={(e) => setData('nama', e.target.value)}
                        className={inputClass}
                        placeholder="Contoh: Ikhwan"
                    />
                    {errors.nama && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.nama}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Telepon / HP
                    </label>
                    <input
                        type="text"
                        value={data.telepon}
                        onChange={(e) => setData('telepon', e.target.value)}
                        className={inputClass}
                        placeholder="Contoh: 08537443 8754"
                    />
                    {errors.telepon && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.telepon}
                        </p>
                    )}
                </div>

                <div className="flex gap-3 pt-2">
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
                              : 'Tambah Kontak'}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}

/* ─── Main Page ────────────────────────────────────────────────────────────── */

const TABS = [
    { key: 'pembina', label: 'Pembina & Penasihat' },
    { key: 'bidang', label: 'Bidang-Bidang' },
    { key: 'kontak', label: 'Kontak' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function StrukturOrganisasi({
    pembinas,
    chairman,
    bidangs,
    kontaks,
    icons,
}: StrukturOrganisasiProps) {
    const [tab, setTab] = useState<TabKey>('pembina');
    const [anggotaModal, setAnggotaModal] = useState<{
        open: boolean;
        kategori: string;
        bidangId: number | null;
        person: Person | null;
    }>({
        open: false,
        kategori: 'pembina_penasihat',
        bidangId: null,
        person: null,
    });
    const [bidangModal, setBidangModal] = useState<{
        open: boolean;
        bidang: Bidang | null;
    }>({
        open: false,
        bidang: null,
    });
    const [kontakModal, setKontakModal] = useState<{
        open: boolean;
        kontak: Kontak | null;
    }>({
        open: false,
        kontak: null,
    });

    const openAnggota = (
        kategori: string,
        bidangId: number | null,
        person: Person | null,
    ) => {
        setAnggotaModal({ open: true, kategori, bidangId, person });
    };

    const handleDeletePerson = (person: Person) => {
        if (confirm(`Yakin ingin menghapus ${person.nama}?`)) {
            router.delete(
                `/dashboard/struktur-organisasi/anggota/${person.id}`,
            );
        }
    };

    const handleDeleteBidang = (bidang: Bidang) => {
        if (
            confirm(
                `Yakin ingin menghapus ${bidang.nama} beserta seluruh anggotanya?`,
            )
        ) {
            router.delete(`/dashboard/struktur-organisasi/bidang/${bidang.id}`);
        }
    };

    const handleDeleteKontak = (kontak: Kontak) => {
        if (confirm(`Yakin ingin menghapus kontak ${kontak.nama}?`)) {
            router.delete(`/dashboard/struktur-organisasi/kontak/${kontak.id}`);
        }
    };

    const editBtns = (onEdit: () => void, onDelete: () => void) => (
        <div className="flex shrink-0 items-center gap-2">
            <ActionButton
                title="Edit"
                onClick={onEdit}
                className="border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
                <Pencil className="size-3.5" />
            </ActionButton>
            <ActionButton
                title="Hapus"
                onClick={onDelete}
                className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
            >
                <Trash2 className="size-3.5" />
            </ActionButton>
        </div>
    );

    return (
        <>
            <Head title="Struktur Organisasi" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                                <Users className="size-7 text-orange-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                                    Struktur Organisasi
                                </h1>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Kelola susunan kepengurusan PARI Pengda
                                    Jambi
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {TABS.map((t) => (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => setTab(t.key)}
                                className={cn(
                                    'rounded-full px-4 py-2 text-xs font-semibold transition-colors',
                                    tab === t.key
                                        ? 'bg-orange-400 text-white shadow-md'
                                        : 'bg-white/60 text-neutral-600 hover:bg-orange-100 dark:bg-neutral-700/40 dark:text-neutral-400 dark:hover:bg-neutral-700',
                                )}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Tab: Pembina & Penasihat ──────────────────── */}
                {tab === 'pembina' && (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {/* Ketua Umum */}
                        <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                            <div className="flex items-center justify-between border-b border-neutral-300/60 px-6 py-4 dark:border-white/10">
                                <div className="flex items-center gap-2">
                                    <Building2 className="size-4 text-orange-400" />
                                    <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                        Ketua Umum
                                    </h2>
                                    <KategoriBadge kategori="ketua_umum" />
                                </div>
                                {chairman && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openAnggota(
                                                'ketua_umum',
                                                null,
                                                chairman,
                                            )
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                                    >
                                        <Pencil className="size-3.5" />
                                        Edit
                                    </button>
                                )}
                            </div>
                            <div className="p-6">
                                {chairman ? (
                                    <div className="flex items-center gap-4">
                                        <PersonAvatar
                                            person={chairman}
                                            size="size-16 text-lg"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-neutral-800 dark:text-neutral-200">
                                                {chairman.nama}
                                            </p>
                                            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                                Ketua Umum PARI Pengda Jambi
                                            </p>
                                        </div>
                                        <ActionButton
                                            title="Hapus"
                                            onClick={() =>
                                                handleDeletePerson(chairman)
                                            }
                                            className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </ActionButton>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openAnggota(
                                                'ketua_umum',
                                                null,
                                                null,
                                            )
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                                    >
                                        <Plus className="size-4" />
                                        Tambah Ketua Umum
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Daftar Pembina & Penasihat */}
                        <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                            <div className="flex items-center justify-between border-b border-neutral-300/60 px-6 py-4 dark:border-white/10">
                                <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                    Daftar Pembina & Penasihat (
                                    {pembinas.length})
                                </h2>
                                <button
                                    type="button"
                                    onClick={() =>
                                        openAnggota(
                                            'pembina_penasihat',
                                            null,
                                            null,
                                        )
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg bg-orange-400 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                                >
                                    <Plus className="size-3.5" />
                                    Tambah
                                </button>
                            </div>
                            <div className="divide-y divide-neutral-100 dark:divide-neutral-700/40">
                                {pembinas.length === 0 ? (
                                    <div className="px-6 py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                        Belum ada pembina / penasihat.
                                    </div>
                                ) : (
                                    pembinas.map((person) => (
                                        <div
                                            key={person.id}
                                            className="flex items-center gap-3 px-6 py-3"
                                        >
                                            <PersonAvatar person={person} />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                                    {person.nama}
                                                </p>
                                                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                                    Urutan {person.sort_order}
                                                </p>
                                            </div>
                                            {editBtns(
                                                () =>
                                                    openAnggota(
                                                        'pembina_penasihat',
                                                        null,
                                                        person,
                                                    ),
                                                () =>
                                                    handleDeletePerson(person),
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Tab: Bidang-Bidang ────────────────────────── */}
                {tab === 'bidang' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                                Bidang-Bidang ({bidangs.length})
                            </h2>
                            <button
                                type="button"
                                onClick={() =>
                                    setBidangModal({ open: true, bidang: null })
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                            >
                                <Plus className="size-4" />
                                Tambah Bidang
                            </button>
                        </div>

                        {bidangs.length === 0 && (
                            <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 px-6 py-12 text-center text-sm text-neutral-500 dark:border-white/10 dark:bg-white/[.075] dark:text-neutral-400">
                                Belum ada bidang.
                            </div>
                        )}

                        {bidangs.map((bidang) => {
                            const Icon =
                                strukturIconMap[
                                    (bidang.icon_key ||
                                        'users') as StrukturIconKey
                                ] ?? Users;

                            return (
                                <div
                                    key={bidang.id}
                                    className="overflow-hidden rounded-2xl border border-neutral-300/60 bg-neutral-100 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]"
                                >
                                    {/* Bidang header */}
                                    <div className="flex items-center justify-between border-b border-neutral-300/60 px-6 py-4 dark:border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                                {Icon && (
                                                    <Icon className="size-4 text-orange-500 dark:text-orange-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                                    {bidang.nama}
                                                </p>
                                                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                                    Urutan {bidang.sort_order}
                                                </p>
                                            </div>
                                        </div>
                                        {editBtns(
                                            () =>
                                                setBidangModal({
                                                    open: true,
                                                    bidang,
                                                }),
                                            () => handleDeleteBidang(bidang),
                                        )}
                                    </div>

                                    {/* Ketua */}
                                    <div className="border-b border-dashed border-orange-200 px-6 py-4 dark:border-orange-800/40">
                                        <div className="mb-3 flex items-center justify-between">
                                            <p className="text-[10px] font-bold tracking-wider text-orange-400 uppercase">
                                                Ketua Bidang
                                            </p>
                                            {!bidang.ketua && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openAnggota(
                                                            'ketua_bidang',
                                                            bidang.id,
                                                            null,
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 transition hover:bg-orange-100 dark:border-orange-800/50 dark:bg-orange-900/20 dark:text-orange-400"
                                                >
                                                    <Plus className="size-3.5" />
                                                    Tambah Ketua
                                                </button>
                                            )}
                                        </div>
                                        {bidang.ketua ? (
                                            <div className="flex items-center gap-3">
                                                <PersonAvatar
                                                    person={bidang.ketua}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                                        {bidang.ketua.nama}
                                                    </p>
                                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                                        {bidang.ketua.inisial}
                                                    </p>
                                                </div>
                                                {editBtns(
                                                    () =>
                                                        openAnggota(
                                                            'ketua_bidang',
                                                            bidang.id,
                                                            bidang.ketua,
                                                        ),
                                                    () =>
                                                        handleDeletePerson(
                                                            bidang.ketua as Person,
                                                        ),
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                Belum ada ketua bidang.
                                            </p>
                                        )}
                                    </div>

                                    {/* Anggota */}
                                    <div className="px-6 py-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <p className="text-[10px] font-bold tracking-wider text-orange-400 uppercase">
                                                Anggota ({bidang.anggota.length}
                                                )
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openAnggota(
                                                        'anggota',
                                                        bidang.id,
                                                        null,
                                                    )
                                                }
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 transition hover:bg-orange-100 dark:border-orange-800/50 dark:bg-orange-900/20 dark:text-orange-400"
                                            >
                                                <Plus className="size-3.5" />
                                                Tambah Anggota
                                            </button>
                                        </div>
                                        {bidang.anggota.length === 0 ? (
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                Belum ada anggota.
                                            </p>
                                        ) : (
                                            <div className="divide-y divide-neutral-100 dark:divide-neutral-700/40">
                                                {bidang.anggota.map(
                                                    (anggota) => (
                                                        <div
                                                            key={anggota.id}
                                                            className="flex items-center gap-3 py-2.5"
                                                        >
                                                            <PersonAvatar
                                                                person={anggota}
                                                                size="size-9 text-[10px]"
                                                            />
                                                            <p className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                                                {anggota.nama}
                                                            </p>
                                                            {editBtns(
                                                                () =>
                                                                    openAnggota(
                                                                        'anggota',
                                                                        bidang.id,
                                                                        anggota,
                                                                    ),
                                                                () =>
                                                                    handleDeletePerson(
                                                                        anggota,
                                                                    ),
                                                            )}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Tab: Kontak ───────────────────────────────── */}
                {tab === 'kontak' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                                Contact Person ({kontaks.length})
                            </h2>
                            <button
                                type="button"
                                onClick={() =>
                                    setKontakModal({ open: true, kontak: null })
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                            >
                                <Plus className="size-4" />
                                Tambah Kontak
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-neutral-300/60 bg-neutral-100 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                            {kontaks.length === 0 ? (
                                <div className="px-6 py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                    Belum ada contact person.
                                </div>
                            ) : (
                                <div className="divide-y divide-neutral-100 dark:divide-neutral-700/40">
                                    {kontaks.map((kontak) => (
                                        <div
                                            key={kontak.id}
                                            className="flex items-center gap-3 px-6 py-4"
                                        >
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                                <Phone className="size-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                                    {kontak.nama}
                                                </p>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {kontak.telepon}
                                                </p>
                                            </div>
                                            {editBtns(
                                                () =>
                                                    setKontakModal({
                                                        open: true,
                                                        kontak,
                                                    }),
                                                () =>
                                                    handleDeleteKontak(kontak),
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Note */}
                <div className="flex items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500">
                    <ChevronRight className="size-3.5" />
                    Data akan otomatis tampil di halaman publik Profil {
                        '>'
                    }{' '}
                    Struktur Organisasi. Foto diupload otomatis menjadi WebP
                    tanpa pengurangan kualitas.
                </div>
            </div>

            {/* Modals */}
            <AnggotaModal
                open={anggotaModal.open}
                initialKategori={anggotaModal.kategori}
                initialBidangId={anggotaModal.bidangId}
                person={anggotaModal.person}
                bidangs={bidangs}
                onClose={() =>
                    setAnggotaModal((s) => ({
                        ...s,
                        open: false,
                        person: null,
                    }))
                }
            />
            <BidangModal
                open={bidangModal.open}
                bidang={bidangModal.bidang}
                icons={icons}
                onClose={() => setBidangModal({ open: false, bidang: null })}
            />
            <KontakModal
                open={kontakModal.open}
                kontak={kontakModal.kontak}
                onClose={() => setKontakModal({ open: false, kontak: null })}
            />
        </>
    );
}

StrukturOrganisasi.layout = {
    breadcrumbs: [
        {
            title: 'Struktur Organisasi',
            href: '/dashboard/struktur-organisasi',
        },
    ],
};
