import { router } from '@inertiajs/react';
import { FileSpreadsheet, Loader2, Upload, X } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

interface ImportCsvModalProps {
    open: boolean;
    onClose: () => void;
    action: string;
    title: string;
    info: ReactNode;
}

export default function ImportCsvModal({
    open,
    onClose,
    action,
    title,
    info,
}: ImportCsvModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    if (!open) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || uploading) {
            return;
        }

        setUploading(true);

        router.post(
            action,
            { file },
            {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => setUploading(false),
                onSuccess: () => {
                    setFile(null);
                    onClose();
                },
            },
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-neutral-300/60 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900">
                <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-white/10">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-800 dark:text-neutral-200">
                        <FileSpreadsheet className="size-5 text-indigo-500" />
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

                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 text-xs leading-relaxed text-neutral-600 dark:border-neutral-700 dark:bg-white/[.075] dark:text-neutral-400">
                        {info}
                    </div>

                    <div>
                        <label htmlFor="csv-file" className="sr-only">
                            Pilih file CSV
                        </label>
                        <input
                            id="csv-file"
                            type="file"
                            required
                            accept=".csv,text/csv"
                            disabled={uploading}
                            onChange={(e) =>
                                setFile(e.target.files?.[0] ?? null)
                            }
                            className="block w-full cursor-pointer rounded-xl border border-dashed border-neutral-300 bg-white/60 p-4 text-xs text-neutral-500 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-indigo-500 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-400"
                        />
                        {file && (
                            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                {file.name}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={uploading}
                            className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={!file || uploading}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Mengimpor...
                                </>
                            ) : (
                                <>
                                    <Upload className="size-4" />
                                    Import CSV
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
