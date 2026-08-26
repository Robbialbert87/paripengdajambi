import { Head } from '@inertiajs/react';
import { ShieldCheck, BadgeCheck, Calendar, User, Briefcase, Hash, FileCheck, Printer } from 'lucide-react';

export default function Verifikasi() {
    return (
        <>
            <Head title="Verifikasi Dokumen" />
            <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-3xl border border-yellow-100/60 bg-white shadow-xl shadow-yellow-400/5 dark:border-neutral-700/40 dark:bg-neutral-900 dark:shadow-black/20">

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
                        <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-5 py-2.5 shadow-md dark:border-green-800/50 dark:bg-green-900/30">
                            <BadgeCheck className="size-5 text-green-500 dark:text-green-400" />
                            <span className="text-sm font-bold tracking-wide text-green-700 dark:text-green-300">
                                TERVERIFIKASI / VALID
                            </span>
                        </div>
                    </div>

                    {/* System Info */}
                    <div className="px-6 pb-2 text-center">
                        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            Sistem Sumber: Database Resmi Pengda PARI Provinsi Jambi
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="mx-6 border-t border-dashed border-neutral-200 dark:border-neutral-700" />

                    {/* Document Owner Data */}
                    <div className="px-6 py-5">
                        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-neutral-800 dark:text-neutral-200">
                            <FileCheck className="size-4 text-orange-400" />
                            DATA PEMILIK DOKUMEN
                        </h2>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-800/60">
                                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                    <User className="size-4 text-orange-500 dark:text-orange-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                        Nama Lengkap
                                    </p>
                                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                        Alen Rizaldi
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-800/60">
                                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                                    <Briefcase className="size-4 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                        Jabatan Resmi
                                    </p>
                                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                        Ketua PARI (Perhimpunan Radiografer Indonesia) Pengda Provinsi Jambi
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-800/60">
                                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                    <Hash className="size-4 text-orange-500 dark:text-orange-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                        Nomor Anggota / ID
                                    </p>
                                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                        (1571041103019)
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-800/60">
                                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <Calendar className="size-4 text-green-500 dark:text-green-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                        Masa Berlaku Jabatan
                                    </p>
                                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                        2024 – 2028
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-neutral-100 bg-neutral-50/80 px-6 py-4 dark:border-neutral-700/40 dark:bg-neutral-800/40">
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                                <Printer className="size-3.5" />
                                Cetak
                            </button>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-4 text-center">
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                        Dokumen ini diverifikasi secara otomatis oleh sistem Database Resmi PARI Pengda Provinsi Jambi.
                    </p>
                </div>
            </div>
        </>
    );
}
