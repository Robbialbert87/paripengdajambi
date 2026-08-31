import { Head, useForm, usePage } from '@inertiajs/react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { changePassword } from '@/routes/dashboard';

const inputClass =
    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200';

export default function PengaturanAkun() {
    const { auth } = usePage().props as {
        auth: {
            user: { must_change_password?: boolean };
        };
    };

    const { data, setData, post, processing, errors, reset } = useForm<{
        password: string;
        password_confirmation: string;
    }>({
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/dashboard/change-password', {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Pengaturan Akun" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-full bg-indigo-500/10 dark:bg-indigo-500/20">
                            <KeyRound className="size-7 text-indigo-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                                Pengaturan Akun
                            </h1>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Perbarui password akun Anda
                            </p>
                        </div>
                    </div>
                </div>

                {auth.user.must_change_password && (
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-300/50 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-300">
                        <ShieldCheck className="mt-0.5 size-5 shrink-0" />
                        <p>
                            Anda perlu memperbarui password sebelum melanjutkan.
                            Password awal Anda adalah NIR.
                        </p>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="max-w-lg rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]"
                >
                    <div className="grid gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                autoFocus
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                        >
                            {processing && <Spinner />}
                            Simpan Password
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

PengaturanAkun.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Akun',
            href: String(changePassword()),
        },
    ],
};
