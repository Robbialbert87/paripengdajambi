import { Head, usePage } from '@inertiajs/react';
import { Barcode, Users, Calendar, FileText, Settings, TrendingUp } from 'lucide-react';
import { dashboard } from '@/routes';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Dashboard() {
    const { auth } = usePage().props as { auth: { user: { name: string; email: string } } };

    const stats = [
        { label: 'Total Anggota', value: '0', icon: Users, color: 'text-blue-400' },
        { label: 'Barcode TTE', value: '0', icon: Barcode, color: 'text-orange-400' },
        { label: 'Event Aktif', value: '0', icon: Calendar, color: 'text-green-400' },
        { label: 'Dokumen', value: '0', icon: FileText, color: 'text-purple-400' },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Welcome Card */}
                <div className="rounded-2xl border border-yellow-100/40 bg-yellow-50/80 p-6 backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-800/80">
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                            <AppLogoIcon className="size-8 text-orange-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                                Selamat Datang, {auth.user.name}
                            </h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {auth.user.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-yellow-100/40 bg-yellow-50/80 p-5 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-orange-400/10 dark:border-neutral-700/40 dark:bg-neutral-800/80"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                        {stat.label}
                                    </p>
                                    <p className="mt-1 text-3xl font-bold text-neutral-800 dark:text-neutral-200">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`flex size-12 items-center justify-center rounded-xl bg-yellow-100/60 dark:bg-neutral-700/60`}>
                                    <stat.icon className={`size-6 ${stat.color}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border border-yellow-100/40 bg-yellow-50/80 p-6 backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-800/80">
                    <h3 className="mb-4 text-lg font-bold text-neutral-800 dark:text-neutral-200">
                        Akses Cepat
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <a
                            href="/dashboard/barcode-tte"
                            className="group flex items-center gap-3 rounded-xl border border-yellow-100/40 bg-white/50 p-4 transition-all duration-300 hover:border-orange-400/40 hover:shadow-md hover:shadow-orange-400/10 dark:border-neutral-700/40 dark:bg-neutral-700/30 dark:hover:border-orange-400/40"
                        >
                            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-400/10 transition-colors group-hover:bg-orange-400/20 dark:bg-orange-400/20 dark:group-hover:bg-orange-400/30">
                                <Barcode className="size-5 text-orange-400" />
                            </div>
                            <div>
                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                    Barcode TTE
                                </span>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Kelola barcode TTE
                                </p>
                            </div>
                        </a>

                        <div className="flex items-center gap-3 rounded-xl border border-dashed border-yellow-100/40 bg-white/20 p-4 opacity-50 dark:border-neutral-700/40 dark:bg-neutral-700/20">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-400/10 dark:bg-neutral-600/20">
                                <Settings className="size-5 text-neutral-400" />
                            </div>
                            <div>
                                <span className="font-semibold text-neutral-500 dark:text-neutral-500">
                                    Segera Hadir
                                </span>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                                    Fitur lainnya
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border border-dashed border-yellow-100/40 bg-white/20 p-4 opacity-50 dark:border-neutral-700/40 dark:bg-neutral-700/20">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-400/10 dark:bg-neutral-600/20">
                                <TrendingUp className="size-5 text-neutral-400" />
                            </div>
                            <div>
                                <span className="font-semibold text-neutral-500 dark:text-neutral-500">
                                    Segera Hadir
                                </span>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                                    Fitur lainnya
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
