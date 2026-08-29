import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    ClipboardCheck,
    Clock,
    FileText,
    Mail,
    MapPin,
    Phone,
    RotateCcw,
    User,
    X,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { verifikasi } from '@/routes/dashboard';
import verifikasiActions from '@/routes/dashboard/verifikasi';

interface RegistrationLog {
    status: string;
    status_label: string;
    note: string | null;
    created_at: string | null;
    performed_by: string | null;
}

interface RegistrationDetail {
    id: number;
    full_name: string | null;
    nik: string | null;
    nir: string;
    email: string;
    phone: string;
    photo: string | null;
    gender_label: string | null;
    blood_type: string | null;
    religion_label: string | null;
    birth_date: string | null;
    home_address: string | null;
    status: string;
    status_label: string;
    rejection_reason: string | null;
    notes: string | null;
    kabupaten_kota: string | null;
    instansi: string | null;
    employment_status_label: string | null;
    str_number: string | null;
    str_status_label: string | null;
    str_expiry_date: string | null;
    education_institution: string | null;
    education_level_label: string | null;
    diploma_number: string | null;
    graduation_year: number | null;
    s2_program: string | null;
    s2_institution: string | null;
    s3_program: string | null;
    s3_institution: string | null;
    diploma_file: string | null;
    field_label: string | null;
    submitted_at: string | null;
    reviewed_at: string | null;
    member_number: string | null;
    logs: RegistrationLog[];
}

interface VerifikasiDetailProps {
    registration: RegistrationDetail;
}

function Info({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {label}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                {value ?? '—'}
            </p>
        </div>
    );
}

const inputClass =
    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200';

export default function VerifikasiDetail({
    registration,
}: VerifikasiDetailProps) {
    const [decisionKey, setDecisionKey] = useState<
        'reject' | 'revision' | null
    >(null);
    const [message, setMessage] = useState('');

    const submitDecision = () => {
        if (!decisionKey) {
            return;
        }

        const isReject = decisionKey === 'reject';
        const url = isReject
            ? verifikasiActions.reject.url({ registration: registration.id })
            : verifikasiActions.revision.url({
                  registration: registration.id,
              });
        const payload = isReject
            ? { rejection_reason: message }
            : { notes: message };

        router.post(url, payload, {
            preserveScroll: true,
            onSuccess: () => {
                setDecisionKey(null);
                setMessage('');
            },
        });
    };

    const process = () => {
        router.post(
            verifikasiActions.process.url({ registration: registration.id }),
            {},
            { preserveScroll: true },
        );
    };

    const approve = () => {
        router.post(
            verifikasiActions.approve.url({ registration: registration.id }),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title={`Verifikasi ${registration.nir}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                <div>
                    <Link
                        href={verifikasi.url()}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition hover:text-orange-400 dark:text-neutral-400"
                    >
                        <ArrowLeft className="size-4" />
                        Kembali ke daftar verifikasi
                    </Link>
                </div>

                <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                                <ClipboardCheck className="size-7 text-orange-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                                    {registration.full_name ?? 'Tanpa nama'}
                                </h1>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {registration.nir}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge
                                status={registration.status}
                                label={registration.status_label}
                            />
                            {registration.status === 'submitted' && (
                                <button
                                    type="button"
                                    onClick={process}
                                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-600"
                                >
                                    <ClipboardCheck className="size-4" />
                                    Proses
                                </button>
                            )}
                            {['submitted', 'under_review'].includes(
                                registration.status,
                            ) && (
                                <>
                                    {registration.status === 'under_review' && (
                                        <button
                                            type="button"
                                            onClick={approve}
                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-600"
                                        >
                                            <CheckCircle2 className="size-4" />
                                            Setujui
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDecisionKey('revision')
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-600 transition hover:bg-violet-100 dark:border-violet-800/50 dark:bg-violet-900/20 dark:text-violet-400"
                                    >
                                        <RotateCcw className="size-4" />
                                        Minta Revisi
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDecisionKey('reject')}
                                        className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
                                    >
                                        <XCircle className="size-4" />
                                        Tolak
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {registration.status === 'approved' && (
                    <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 p-5 dark:border-emerald-800/40 dark:bg-emerald-900/20">
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                            Anggota berhasil diaktifkan
                        </p>
                        <p className="mt-1 text-sm text-emerald-700/80 dark:text-emerald-400/80">
                            Nomor Anggota:{' '}
                            <span className="font-mono font-bold">
                                {registration.member_number}
                            </span>
                        </p>
                    </div>
                )}

                {registration.status === 'rejected' &&
                    registration.rejection_reason && (
                        <div className="rounded-2xl border border-red-200/70 bg-red-50/80 p-5 dark:border-red-800/40 dark:bg-red-900/20">
                            <p className="text-sm font-bold text-red-700 dark:text-red-400">
                                Alasan penolakan
                            </p>
                            <p className="mt-1 text-sm text-red-700/80 dark:text-red-400/80">
                                {registration.rejection_reason}
                            </p>
                        </div>
                    )}

                {registration.status === 'revision' && registration.notes && (
                    <div className="rounded-2xl border border-violet-200/70 bg-violet-50/80 p-5 dark:border-violet-800/40 dark:bg-violet-900/20">
                        <p className="text-sm font-bold text-violet-700 dark:text-violet-400">
                            Catatan revisi
                        </p>
                        <p className="mt-1 text-sm text-violet-700/80 dark:text-violet-400/80">
                            {registration.notes}
                        </p>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md lg:col-span-2 dark:border-white/10 dark:bg-white/[.075]">
                        <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                            Data Pemohon
                        </h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-xl border border-neutral-300/60 bg-white/60 p-4 dark:border-white/10 dark:bg-neutral-900/40">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-orange-400 dark:bg-orange-400/20">
                                    {registration.photo ? (
                                        <img
                                            src={`/storage/${registration.photo}`}
                                            alt={registration.full_name ?? ''}
                                            className="size-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="size-5" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                        {registration.full_name ?? 'Tanpa nama'}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {registration.nir}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-neutral-300/60 bg-white/60 p-4 dark:border-white/10 dark:bg-neutral-900/40">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                                    <ClipboardCheck className="size-5 text-orange-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-mono text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                        {registration.nir}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        NIR
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-neutral-300/60 bg-white/60 p-4 dark:border-white/10 dark:bg-neutral-900/40">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                                    <ClipboardCheck className="size-5 text-orange-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-mono text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                        {registration.nik ?? '—'}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        NIK
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-neutral-300/60 bg-white/60 p-4 dark:border-white/10 dark:bg-neutral-900/40">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                                    <Mail className="size-5 text-orange-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                        {registration.email}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        Email
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-neutral-300/60 bg-white/60 p-4 dark:border-white/10 dark:bg-neutral-900/40">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                                    <Phone className="size-5 text-orange-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                        {registration.phone}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        Telepon
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-neutral-300/60 bg-white/60 p-4 dark:border-white/10 dark:bg-neutral-900/40">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                                    <Building2 className="size-5 text-orange-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                        {registration.instansi ?? '—'}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        Instansi/Tempat Kerja
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-neutral-300/60 bg-white/60 p-4 dark:border-white/10 dark:bg-neutral-900/40">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                                    <MapPin className="size-5 text-orange-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                        {registration.kabupaten_kota ?? '—'}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        Wilayah
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                        <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                            Riwayat Verifikasi
                        </h2>
                        <ol className="mt-4 space-y-4">
                            {registration.logs.map((log, index) => (
                                <li key={index} className="relative flex gap-3">
                                    <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                                        <Clock className="size-3 text-orange-400" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                                            {log.status_label}
                                        </p>
                                        {log.note && (
                                            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                                {log.note}
                                            </p>
                                        )}
                                        <p className="mt-0.5 text-[11px] text-neutral-400 dark:text-neutral-500">
                                            {log.created_at} · oleh{' '}
                                            {log.performed_by ?? 'Sistem'}
                                        </p>
                                    </div>
                                </li>
                            ))}
                            <li className="relative flex gap-3">
                                <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                                    <Clock className="size-3 text-orange-400" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                                        Pengajuan dibuat
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-neutral-400 dark:text-neutral-500">
                                        {registration.submitted_at} · oleh
                                        Pemohon
                                    </p>
                                </div>
                            </li>
                        </ol>
                    </div>
                </div>

                <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                    <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                        Detail Keanggotaan
                    </h2>
                    <div className="mt-4 grid gap-6 lg:grid-cols-3">
                        <div className="space-y-3 rounded-xl border border-neutral-300/60 bg-white/60 p-4 dark:border-white/10 dark:bg-neutral-900/40">
                            <h3 className="text-xs font-bold text-orange-500">
                                Data Pribadi
                            </h3>
                            <Info label="Jenis Kelamin" value={registration.gender_label} />
                            <Info label="Golongan Darah" value={registration.blood_type} />
                            <Info label="Agama" value={registration.religion_label} />
                            <Info label="Tanggal Lahir" value={registration.birth_date} />
                            <Info label="Alamat Tempat Tinggal" value={registration.home_address} />
                        </div>
                        <div className="space-y-3 rounded-xl border border-neutral-300/60 bg-white/60 p-4 dark:border-white/10 dark:bg-neutral-900/40">
                            <h3 className="text-xs font-bold text-orange-500">
                                Data Pekerjaan
                            </h3>
                            <Info label="Status Kepegawaian" value={registration.employment_status_label} />
                            <Info label="Instansi / Tempat Kerja" value={registration.instansi} />
                            <Info label="Wilayah" value={registration.kabupaten_kota} />
                            <Info label="Nomor STR" value={registration.str_number} />
                            <Info label="Status STR" value={registration.str_status_label} />
                            <Info label="Masa Berlaku STR" value={registration.str_expiry_date} />
                        </div>
                        <div className="space-y-3 rounded-xl border border-neutral-300/60 bg-white/60 p-4 dark:border-white/10 dark:bg-neutral-900/40">
                            <h3 className="text-xs font-bold text-orange-500">
                                Data Pendidikan
                            </h3>
                            <Info
                                label="Institusi Pendidikan"
                                value={registration.education_institution}
                            />
                            <Info label="Jenjang" value={registration.education_level_label} />
                            <Info label="Nomor Ijazah" value={registration.diploma_number} />
                            <Info
                                label="Tahun Lulus"
                                value={
                                    registration.graduation_year
                                        ? String(registration.graduation_year)
                                        : null
                                }
                            />
                            <Info label="Bidang Keprofesian" value={registration.field_label} />
                            <Info
                                label="Pendidikan Lanjutan"
                                value={
                                    registration.s2_program ||
                                    registration.s3_program ? (
                                        <>
                                            {registration.s2_program &&
                                                `S2 ${registration.s2_program}${registration.s2_institution ? ` — ${registration.s2_institution}` : ''}`}
                                            {registration.s2_program &&
                                                registration.s3_program && (
                                                    <span className="mx-1">·</span>
                                                )}
                                            {registration.s3_program &&
                                                `S3 ${registration.s3_program}${registration.s3_institution ? ` — ${registration.s3_institution}` : ''}`}
                                        </>
                                    ) : (
                                        '—'
                                    )
                                }
                            />
                            {registration.diploma_file && (
                                <div>
                                    <a
                                        href={`/storage/${registration.diploma_file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 underline-offset-2 hover:underline"
                                    >
                                        <FileText className="size-3.5" />
                                        Unduh scan ijazah
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {decisionKey && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-neutral-300/60 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900">
                        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-white/10">
                            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                                {decisionKey === 'reject'
                                    ? 'Tolak Registrasi'
                                    : 'Minta Revisi'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setDecisionKey(null);
                                    setMessage('');
                                }}
                                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                submitDecision();
                            }}
                            className="space-y-4 px-6 py-4"
                        >
                            <div>
                                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    {decisionKey === 'reject'
                                        ? 'Alasan penolakan'
                                        : 'Catatan yang perlu diperbaiki'}
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    className={inputClass}
                                    placeholder={
                                        decisionKey === 'reject'
                                            ? 'Jelaskan alasan penolakan'
                                            : 'Jelaskan bagian yang perlu direvisi'
                                    }
                                />
                                {message.trim() === '' && (
                                    <p className="mt-1 text-xs text-red-500">
                                        Alasan wajib diisi.
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDecisionKey(null);
                                        setMessage('');
                                    }}
                                    className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={message.trim() === ''}
                                    className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition disabled:opacity-50 ${
                                        decisionKey === 'reject'
                                            ? 'bg-red-500 hover:bg-red-600'
                                            : 'bg-violet-500 hover:bg-violet-600'
                                    }`}
                                >
                                    Kirim
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

VerifikasiDetail.layout = {
    breadcrumbs: [
        {
            title: 'Verifikasi Registrasi',
            href: verifikasi.url(),
        },
    ],
};
