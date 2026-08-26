import { Head } from '@inertiajs/react';
import { useRef, useCallback } from 'react';
import { Download, ExternalLink, Barcode } from 'lucide-react';

const VERIFICATION_URL = 'http://paripengdajambi.test/verifikasi/1571041103019';
const MEMBER_ID = '1571041103019';

export default function BarcodeTtePage() {
    const imgRef = useRef<HTMLImageElement>(null);

    const handleDownload = useCallback(() => {
        const img = imgRef.current;
        if (!img) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pngSize = 1024;
        canvas.width = pngSize;
        canvas.height = pngSize;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pngSize, pngSize);
        ctx.drawImage(img, 0, 0, pngSize, pngSize);

        const link = document.createElement('a');
        link.download = `barcode-tte-${MEMBER_ID}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }, []);

    return (
        <>
            <Head title="Barcode TTE" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="rounded-2xl border border-yellow-100/40 bg-yellow-50/80 p-6 backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-800/80">
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                            <Barcode className="size-7 text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                                Barcode TTE
                            </h1>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Scan barcode ini untuk verifikasi dokumen
                            </p>
                        </div>
                    </div>
                </div>

                {/* QR Code Card */}
                <div className="flex justify-center">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-yellow-100/40 bg-yellow-50/80 backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-800/80">
                        {/* Top */}
                        <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-4 text-center dark:from-orange-500 dark:to-orange-600">
                            <h2 className="text-sm font-bold tracking-wide text-white">
                                BARCODE TANDA TANGAN ELEKTRONIK
                            </h2>
                            <p className="mt-0.5 text-xs text-white/80">
                                PARI Pengda Provinsi Jambi
                            </p>
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center gap-5 px-6 py-8">
                            <div className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-700/40 dark:bg-neutral-800">
                                <img
                                    ref={imgRef}
                                    src="/qr-code.png"
                                    alt="QR Code Barcode TTE"
                                    className="block w-full h-auto"
                                />
                            </div>

                            <div className="text-center">
                                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                    Nomor Anggota
                                </p>
                                <p className="mt-0.5 text-lg font-bold text-neutral-800 dark:text-neutral-200">
                                    {MEMBER_ID}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex w-full flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={handleDownload}
                                    className="inline-flex w-full items-center justify-center gap-x-2 rounded-xl border border-transparent bg-orange-400 px-4 py-3 text-sm font-bold text-neutral-50 ring-zinc-500 transition duration-300 hover:bg-orange-500 focus-visible:ring-3 outline-hidden dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:outline-hidden dark:ring-zinc-200"
                                >
                                    <Download className="size-4" />
                                    Download PNG
                                </button>

                                <a
                                    href={VERIFICATION_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex w-full items-center justify-center gap-x-2 rounded-xl border border-yellow-100/40 bg-white/50 px-4 py-3 text-sm font-bold text-neutral-700 ring-zinc-500 transition duration-300 hover:bg-yellow-100/60 focus-visible:ring-3 outline-hidden dark:border-neutral-700/40 dark:bg-neutral-700/30 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:outline-hidden dark:ring-zinc-200"
                                >
                                    <ExternalLink className="size-4" />
                                    Lihat Halaman Verifikasi
                                </a>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-yellow-100/40 bg-yellow-100/20 px-6 py-3 text-center dark:border-neutral-700/40 dark:bg-neutral-800/40">
                            <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                                {VERIFICATION_URL}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
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
