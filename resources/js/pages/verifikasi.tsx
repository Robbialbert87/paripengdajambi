import { Head } from '@inertiajs/react';
import {
    ShieldCheck,
    BadgeCheck,
    Calendar,
    User,
    Briefcase,
    Hash,
    FileCheck,
    AlertTriangle,
    XCircle,
} from 'lucide-react';

interface VerifikasiRecord {
    nama_lengkap: string;
    nomor_anggota: string;
    jabatan: string;
    tahun_mulai: number;
    tahun_selesai: number;
    is_active: boolean;
    status: string;
}

interface VerifikasiProps {
    record: VerifikasiRecord | null;
}

export default function Verifikasi({ record }: VerifikasiProps) {
    const pageTitle = record
        ? `Verifikasi TTE - ${record.nama_lengkap}`
        : 'Verifikasi Tanda Tangan Elektronik';

    const renderStatus = () => {
        if (!record) {
            return (
                <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-2.5 shadow-md dark:border-red-800/50 dark:bg-red-900/30">
                    <XCircle className="size-5 text-red-500 dark:text-red-400" />
                    <span className="text-sm font-bold tracking-wide text-red-700 dark:text-red-300">
                        TIDAK DITEMUKAN
                    </span>
                </div>
            );
        }

        if (record.status === 'active') {
            return (
                <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-5 py-2.5 shadow-md dark:border-green-800/50 dark:bg-green-900/30">
                    <BadgeCheck className="size-5 text-green-500 dark:text-green-400" />
                    <span className="text-sm font-bold tracking-wide text-green-700 dark:text-green-300">
                        TERVERIFIKASI / VALID
                    </span>
                </div>
            );
        }

        if (record.status === 'expired') {
            return (
                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-5 py-2.5 shadow-md dark:border-yellow-800/50 dark:bg-yellow-900/30">
                    <AlertTriangle className="size-5 text-yellow-500 dark:text-yellow-400" />
                    <span className="text-sm font-bold tracking-wide text-yellow-700 dark:text-yellow-300">
                        MASA BERLAKU HABIS
                    </span>
                </div>
            );
        }

        return (
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-5 py-2.5 shadow-md dark:border-neutral-700 dark:bg-neutral-800">
                <XCircle className="size-5 text-neutral-500 dark:text-neutral-400" />
                <span className="text-sm font-bold tracking-wide text-neutral-700 dark:text-neutral-300">
                    TIDAK AKTIF
                </span>
            </div>
        );
    };

    return (
        <>
            <Head title={pageTitle} />
            <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-3xl border border-neutral-300/60 bg-white shadow-xl shadow-yellow-400/5 dark:border-white/10 dark:bg-neutral-900 dark:shadow-black/20">
                    {/* Top Banner */}
                    <div className="relative bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-8 text-center dark:from-orange-500 dark:to-orange-600">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-40" />
                        <div className="relative">
                            <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 backdrop-blur-sm">
                                <ShieldCheck className="size-8 text-white" />
                            </div>
                            <h1 className="text-lg font-bold tracking-wide text-white sm:text-xl">
                                HASIL VERIFIKASI DOKUMEN
                            </h1>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center px-6 py-5">
                        {renderStatus()}
                    </div>

                    {/* System Info */}
                    <div className="px-6 pb-2 text-center">
                        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            Sistem Sumber: Database Resmi Pengda PARI Provinsi
                            Jambi
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="mx-6 border-t border-dashed border-neutral-200 dark:border-neutral-700" />

                    {record ? (
                        <>
                            {/* Document Owner Data */}
                            <div className="px-6 py-5">
                                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-neutral-800 dark:text-neutral-200">
                                    <FileCheck className="size-4 text-orange-400" />
                                    DATA PEMILIK DOKUMEN
                                </h2>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3.5 dark:bg-white/[.075]">
                                        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                            <User className="size-4 text-orange-500 dark:text-orange-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                Nama Lengkap
                                            </p>
                                            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                                {record.nama_lengkap}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3.5 dark:bg-white/[.075]">
                                        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-200/80 dark:bg-white/[.075]">
                                            <Briefcase className="size-4 text-orange-500 dark:text-orange-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                Jabatan Resmi
                                            </p>
                                            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                                {record.jabatan}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3.5 dark:bg-white/[.075]">
                                        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                            <Hash className="size-4 text-orange-500 dark:text-orange-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                Nomor Anggota / ID
                                            </p>
                                            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                                ({record.nomor_anggota})
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3.5 dark:bg-white/[.075]">
                                        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                            <Calendar className="size-4 text-green-500 dark:text-green-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                Masa Berlaku Jabatan
                                            </p>
                                            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                                {record.tahun_mulai} –{' '}
                                                {record.tahun_selesai}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="px-6 py-8 text-center">
                            <XCircle className="mx-auto size-12 text-red-300 dark:text-red-600" />
                            <p className="mt-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                Data anggota tidak ditemukan dalam database.
                            </p>
                            <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                                Pastikan nomor anggota yang dimasukkan sudah
                                benar.
                            </p>
                        </div>
                    )}
                </div>

                {/* Disclaimer */}
                <div className="mt-4 text-center">
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                        Dokumen ini diverifikasi secara otomatis oleh sistem
                        Database Resmi PARI Pengda Provinsi Jambi.
                    </p>
                </div>
            </div>
        </>
    );
}
