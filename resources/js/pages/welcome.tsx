import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Selamat Datang" />

            {/* Hero Section */}
            <section className="mx-auto grid max-w-[85rem] gap-4 px-4 py-14 sm:px-6 md:grid-cols-2 md:items-center md:gap-8 lg:px-8 2xl:max-w-full">
                <div className="order-1 md:order-1">
                    <h1 className="block text-3xl font-bold tracking-tight text-balance text-neutral-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-neutral-200">
                        Selamat Datang di Website{' '}
                        <span className="text-orange-400">PARI Pengda</span>{' '}
                        Provinsi Jambi
                    </h1>
                    <p className="mt-3 text-lg leading-relaxed text-pretty text-neutral-700 lg:w-4/5 dark:text-neutral-400">
                        Pusat Berita, Informasi, Edukasi dan Pelayanan Administrasi Radiografer Provinsi Jambi.
                    </p>
                </div>
                <div className="order-2 md:order-2 flex w-full items-center justify-center">
                    <img
                        src="/hero.webp"
                        alt="PARI - Persatuan Ahli Refrigerasi Indonesia"
                        className="h-64 w-auto object-contain sm:h-80 md:h-96"
                    />
                </div>
                <div className="order-3 md:order-3 grid w-full gap-3 sm:inline-flex">
                    <Link
                        href="/keanggotaan/registrasi"
                        className="group inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-orange-400 px-4 py-3 text-sm font-bold text-neutral-50 ring-zinc-500 transition duration-300 hover:bg-orange-500 focus-visible:ring-3 outline-hidden 2xl:text-base dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:outline-hidden dark:ring-zinc-200"
                    >
                        Daftar Menjadi Anggota
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Stats Section */}
            <section className="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 2xl:max-w-full">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-xl border border-yellow-100/40 bg-yellow-50/60 p-6 text-center backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-800/80">
                        <div className="text-3xl font-bold text-orange-400">500+</div>
                        <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Anggota</div>
                    </div>
                    <div className="rounded-xl border border-yellow-100/40 bg-yellow-50/60 p-6 text-center backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-800/80">
                        <div className="text-3xl font-bold text-orange-400">50+</div>
                        <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Event per Tahun</div>
                    </div>
                    <div className="rounded-xl border border-yellow-100/40 bg-yellow-50/60 p-6 text-center backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-800/80">
                        <div className="text-3xl font-bold text-orange-400">30+</div>
                        <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Kota</div>
                    </div>
                    <div className="rounded-xl border border-yellow-100/40 bg-yellow-50/60 p-6 text-center backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-800/80">
                        <div className="text-3xl font-bold text-orange-400">25</div>
                        <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Tahun Berdiri</div>
                    </div>
                </div>
            </section>
        </>
    );
}
