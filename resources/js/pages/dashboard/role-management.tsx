import { Head, router } from '@inertiajs/react';
import { Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { roleManagement } from '@/routes/dashboard';

interface RoleItem {
    id: number;
    name: string;
    slug: string;
    permissions: string[];
}

interface RoleManagementProps {
    roles: RoleItem[];
    features: Record<string, string>;
}

function RoleCard({ role, features }: { role: RoleItem; features: Record<string, string> }) {
    const [selected, setSelected] = useState<string[]>(role.permissions);
    const [saving, setSaving] = useState(false);

    const toggle = (feature: string) => {
        setSelected((current) =>
            current.includes(feature)
                ? current.filter((item) => item !== feature)
                : [...current, feature],
        );
    };

    const save = () => {
        setSaving(true);
        router.put(
            `/dashboard/role-management/${role.id}`,
            { permissions: selected },
            { preserveScroll: true, onFinish: () => setSaving(false) },
        );
    };

    const entries = Object.entries(features);
    const memberFeatures = new Set([
        'member-dashboard',
        'member-kartu',
        'member-direktori',
        'member-event',
        'member-dokumen',
        'member-pengaturan',
    ]);

    const isSuperAdmin = role.slug === 'admin';

    return (
        <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-orange-400/10 dark:bg-orange-400/20">
                        {isSuperAdmin ? (
                            <ShieldCheck className="size-5 text-orange-400" />
                        ) : (
                            <Sparkles className="size-5 text-orange-400" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                            {role.name}
                        </h3>
                        <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                            {role.slug}
                        </p>
                    </div>
                </div>
                {isSuperAdmin && (
                    <Badge className="border-transparent bg-orange-400/10 text-orange-600 dark:bg-orange-400/20 dark:text-orange-400">
                        Superuser
                    </Badge>
                )}
            </div>

            {isSuperAdmin && (
                <p className="mb-4 rounded-xl bg-white/50 p-3 text-sm text-neutral-600 dark:bg-neutral-700/30 dark:text-neutral-300">
                    Role admin selalu memiliki seluruh akses apa pun pilihan di
                    bawah ini.
                </p>
            )}

            {entries.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2">
                    {[
                        {
                            title: 'Portal Anggota',
                            items: entries.filter(([slug]) =>
                                memberFeatures.has(slug),
                            ),
                        },
                        {
                            title: 'Administrasi',
                            items: entries.filter(
                                ([slug]) => !memberFeatures.has(slug),
                            ),
                        },
                    ]
                        .filter((group) => group.items.length > 0)
                        .map((group) => (
                            <div key={group.title}>
                                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    {group.title}
                                </p>
                                <div className="space-y-2">
                                    {group.items.map(([slug, label]) => (
                                        <label
                                            key={slug}
                                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-300/60 bg-white/50 px-3 py-2 transition hover:bg-white/80 dark:border-white/10 dark:bg-neutral-700/30 dark:hover:bg-neutral-700/50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(slug)}
                                                onChange={() => toggle(slug)}
                                                className="size-4 rounded border-neutral-300 text-orange-400 focus:ring-orange-400/20 dark:border-neutral-600"
                                            />
                                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                {label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            )}

            <div className="mt-5 flex items-center justify-end gap-3">
                {!isSuperAdmin && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {selected.length} dari {entries.length} fitur aktif
                    </p>
                )}
                <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500 disabled:opacity-50 dark:bg-orange-500 dark:hover:bg-orange-600"
                >
                    {saving ? 'Menyimpan...' : 'Simpan Hak Akses'}
                </button>
            </div>
        </div>
    );
}

export default function RoleManagement({ roles, features }: RoleManagementProps) {
    return (
        <>
            <Head title="Role & Hak Akses" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                                <Lock className="size-7 text-orange-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                                    Role & Hak Akses
                                </h1>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Atur menu dan fitur yang boleh diakses
                                    setiap role
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                            <ShieldCheck className="size-4 text-orange-400" />
                            {roles.length} role aktif
                        </div>
                    </div>
                </div>

                {roles.length === 0 ? (
                    <div className={cn(
                        'rounded-2xl border border-dashed border-neutral-300/70 bg-neutral-100 p-10 text-center dark:border-white/10 dark:bg-white/[.075]',
                    )}>
                        <Lock className="mx-auto size-10 text-orange-400" />
                        <p className="mt-3 font-semibold text-neutral-700 dark:text-neutral-300">
                            Belum ada role terdaftar.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {roles.map((role) => (
                            <RoleCard key={role.id} role={role} features={features} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

RoleManagement.layout = {
    breadcrumbs: [
        {
            title: 'Role & Hak Akses',
            href: String(roleManagement()),
        },
    ],
};