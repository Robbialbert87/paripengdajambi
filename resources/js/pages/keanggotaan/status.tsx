import { Form, Head } from '@inertiajs/react';
import {
    CheckCircle2,
    ClipboardList,
    Clock,
    Mail,
    MapPin,
    Search,
    XCircle,
} from 'lucide-react';
import { tracking } from '@/routes/keanggotaan/status';

interface RegistrationLog {
    status: string;
    status_label: string;
    note: string | null;
    created_at: string | null;
    performed_by: string | null;
}

interface RegistrationResult {
    full_name: string | null;
    nir: string;
    status: string;
    status_label: string;
    submitted_at: string | null;
    reviewed_at: string | null;
    notes: string | null;
    rejection_reason: string | null;
    kabupaten_kota: string | null;
    instansi: string | null;
    logs: RegistrationLog[];
}

interface StatusProps {
    registration: RegistrationResult | null;
}

const inputClass =
    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200';

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        draft: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300',
        submitted:
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        under_review:
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        revision:
            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        approved:
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        rejected:
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${styles[status] ?? styles.draft}`}
        >
            {status === 'approved' ? (
                <CheckCircle2 className="size-3.5" />
            ) : (
                <Clock className="size-3.5" />
            )}
            {statusLabel(status)}
        </span>
    );
}

function statusLabel(status: string): string {
    const labels: Record<string, string> = {
        draft: 'Draf',
        submitted: 'Diajukan',
        under_review: 'Dalam Review',
        revision: 'Revisi Diperlukan',
        approved: 'Disetujui',
        rejected: 'Ditolak',
    };

    return labels[status] ?? status;
}

export default function Status({ registration }: StatusProps) {
    return (
        <>
            <Head title="Cek Status Pendaftaran" />

            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
                <div className="text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/60 px-4 py-1 text-xs font-bold text-orange-600 dark:border-orange-800/50 dark:bg-orange-900/20 dark:text-orange-400">
                        <Search className="size-3.5" />
                        Cek Status
                    </span>
                    <h1 className="mt-4 text-3xl font-bold text-neutral-800 dark:text-neutral-200">
                        Status Pendaftaran Anggota
                    </h1>
                    <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600 dark:text-neutral-400">
                        Masukkan NIR dan email yang digunakan saat mendaftar
                        untuk melihat perkembangan pengajuan.
                    </p>
                </div>

                {registration ? (
                    <div className="mt-10 space-y-6">
                        {/* Result card */}
                        <div className="overflow-hidden rounded-2xl border border-neutral-300/60 bg-neutral-100 dark:border-white/10 dark:bg-white/[.075]">
                            <div className="border-b border-neutral-200/80 px-6 py-5 dark:border-white/10">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-[11px] font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                            NIR
                                        </p>
                                        <p className="mt-0.5 text-xl font-extrabold tracking-wide text-neutral-800 dark:text-neutral-200">
                                            {registration.nir}
                                        </p>
                                    </div>
                                    <StatusBadge status={registration.status} />
                                </div>
                            </div>

                            <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
                                <div>
                                    <p className="text-[11px] font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                        Nama
                                    </p>
                                    <p className="mt-0.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                        {registration.full_name ?? '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                        NIR
                                    </p>
                                    <p className="mt-0.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                        {registration.nir}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="size-4 text-orange-400" />
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {registration.kabupaten_kota ?? '-'}
                                        {registration.instansi
                                            ? ` • ${registration.instansi}`
                                            : ''}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="size-4 text-orange-400" />
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {registration.submitted_at
                                            ? `Diajukan pada ${registration.submitted_at}`
                                            : '-'}
                                    </p>
                                </div>
                            </div>

                            {(registration.rejection_reason ||
                                registration.notes) && (
                                <div className="border-t border-neutral-200/80 px-6 py-4 dark:border-white/10">
                                    <p className="text-[11px] font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                        Catatan Pengurus
                                    </p>
                                    <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                                        {registration.rejection_reason ??
                                            registration.notes ??
                                            '-'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Timeline */}
                        {registration.logs.length > 0 && (
                            <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 dark:border-white/10 dark:bg-white/[.075]">
                                <h2 className="flex items-center gap-2 text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                    <ClipboardList className="size-4 text-orange-400" />
                                    Riwayat Pengajuan
                                </h2>
                                <ol className="mt-5 space-y-0">
                                    {registration.logs.map((log, index) => (
                                        <li
                                            key={index}
                                            className="relative flex gap-4 pb-6 last:pb-0"
                                        >
                                            {index <
                                                registration.logs.length -
                                                    1 && (
                                                <span className="absolute top-5 left-[9px] h-full w-px bg-orange-200 dark:bg-neutral-700" />
                                            )}
                                            <span className="relative mt-1 size-[19px] shrink-0 rounded-full border-2 border-orange-300 bg-white dark:border-orange-500 dark:bg-neutral-800" />
                                            <div>
                                                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                                    {log.status_label}
                                                </p>
                                                {log.note && (
                                                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                                        {log.note}
                                                    </p>
                                                )}
                                                <p className="mt-0.5 text-[11px] text-neutral-400 dark:text-neutral-500">
                                                    {log.created_at ?? '-'}
                                                    {log.performed_by
                                                        ? ` • oleh ${log.performed_by}`
                                                        : ''}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mt-10 rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 sm:p-8 dark:border-white/10 dark:bg-white/[.075]">
                        <Form
                            {...tracking.form()}
                            disableWhileProcessing
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div>
                                        <label
                                            htmlFor="nir"
                                            className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                        >
                                            NIR
                                        </label>
                                        <input
                                            id="nir"
                                            name="nir"
                                            type="text"
                                            required
                                            placeholder="Contoh: 1571041103019"
                                            className={inputClass}
                                        />
                                        {errors.nir && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.nir}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            placeholder="email@contoh.com"
                                            className={inputClass}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-500 disabled:opacity-50 dark:bg-orange-500 dark:hover:bg-orange-600"
                                    >
                                        <Search className="size-4" />
                                        {processing
                                            ? 'Memeriksa...'
                                            : 'Cek Status'}
                                    </button>
                                </>
                            )}
                        </Form>
                    </div>
                )}

                {registration?.status !== 'approved' && !registration && (
                    <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-neutral-500 dark:text-neutral-400">
                        <XCircle className="size-3.5" />
                        Gunakan NIR Anda untuk memantau status pengajuan.
                    </p>
                )}
            </div>
        </>
    );
}
