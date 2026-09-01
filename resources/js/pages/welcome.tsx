import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Selamat Datang" />

            {/* Hero Section */}
            <section className="relative left-1/2 -mt-[88px] -ml-[50vw] flex min-h-[calc(100vh)] w-screen items-center overflow-hidden">
                <div className="absolute inset-0 bg-black" aria-hidden="true">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover"
                    >
                        <source src="/hero/hero.mp4" type="video/mp4" />
                    </video>
                </div>
                <div
                    className="absolute inset-0 bg-black/50"
                    aria-hidden="true"
                />

                <div className="relative z-10 mx-auto w-full max-w-[85rem] px-4 pt-32 pb-14 sm:px-6 lg:px-8 2xl:max-w-full">
                    <h1 className="block text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-6xl lg:leading-tight">
                        Selamat Datang di Website
                        <br />
                        <span className="text-orange-400">
                            PARI Pengda
                        </span>{' '}
                        Provinsi Jambi
                    </h1>
                    <p className="mt-3 text-lg leading-relaxed text-pretty text-neutral-200 lg:w-4/5">
                        Pusat Berita, Informasi, Edukasi dan Pelayanan
                        Administrasi Radiografer Provinsi Jambi.
                    </p>

                    <div className="mt-8">
                        <Link
                            href="/keanggotaan/registrasi"
                            className="group inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-orange-400 px-4 py-3 text-sm font-bold text-neutral-50 ring-zinc-500 outline-hidden transition duration-300 hover:bg-orange-500 focus-visible:ring-3 2xl:text-base"
                        >
                            Daftar Menjadi Anggota
                            <svg
                                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 2xl:max-w-full">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-xl border border-neutral-300/60 bg-neutral-100 p-6 text-center backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                        <div className="text-3xl font-bold text-orange-400">
                            500+
                        </div>
                        <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Anggota
                        </div>
                    </div>
                    <div className="rounded-xl border border-neutral-300/60 bg-neutral-100 p-6 text-center backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                        <div className="text-3xl font-bold text-orange-400">
                            50+
                        </div>
                        <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Event per Tahun
                        </div>
                    </div>
                    <div className="rounded-xl border border-neutral-300/60 bg-neutral-100 p-6 text-center backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                        <div className="text-3xl font-bold text-orange-400">
                            30+
                        </div>
                        <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Kota
                        </div>
                    </div>
                    <div className="rounded-xl border border-neutral-300/60 bg-neutral-100 p-6 text-center backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                        <div className="text-3xl font-bold text-orange-400">
                            25
                        </div>
                        <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Tahun Berdiri
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
