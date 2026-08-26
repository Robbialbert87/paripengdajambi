import { Head } from '@inertiajs/react';

export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <>
            <Head title={title} />
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-200">{title}</h1>
                    <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
                        Halaman ini sedang dalam pengembangan.
                    </p>
                </div>
            </div>
        </>
    );
}
