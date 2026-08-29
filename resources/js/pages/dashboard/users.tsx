import { Head, useForm, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, UserCog, UsersRound, X } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/dashboard/data-table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RoleOption {
    id: number;
    name: string;
    slug: string;
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    role_id: number | null;
    is_active: boolean;
    email_verified_at: string | null;
    role: Pick<RoleOption, 'id' | 'name' | 'slug'> | null;
}

interface UsersProps {
    users: UserItem[];
    roles: RoleOption[];
}

const inputClass =
    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200';

function roleLabel(role: UserItem['role']): string {
    return role?.name ?? '—';
}

function RoleBadge({ role }: { role: UserItem['role'] }) {
    const styles: Record<string, string> = {
        admin: 'border-transparent bg-orange-400/10 text-orange-600 dark:bg-orange-400/20 dark:text-orange-400',
        pengurus:
            'border-transparent bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
        member:
            'border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    };

    return (
        <Badge className={role ? (styles[role.slug] ?? styles.member) : styles.member}>
            {roleLabel(role)}
        </Badge>
    );
}

function StatusBadge({ active }: { active: boolean }) {
    return active ? (
        <Badge className="border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            Aktif
        </Badge>
    ) : (
        <Badge className="border-transparent bg-neutral-200/70 text-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-400">
            Nonaktif
        </Badge>
    );
}

const initialCreateForm = {
    name: '',
    email: '',
    password: '',
    role_id: '',
};

interface CreateModalProps {
    open: boolean;
    onClose: () => void;
    roles: RoleOption[];
}

function CreateModal({ open, onClose, roles }: CreateModalProps) {
    const form = useForm(initialCreateForm);

    form.transform((data) => ({
        ...data,
        role_id: Number(data.role_id),
    }));

    const { data, setData, post, processing, errors, reset } = form;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/dashboard/user-management', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-300/60 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900">
                <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-white/10">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                        Tambah Pengguna
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
                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            autoFocus
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={inputClass}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={inputClass}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Kata Sandi
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
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
                            Role
                        </label>
                        <select
                            value={data.role_id}
                            onChange={(e) => setData('role_id', e.target.value)}
                            className={inputClass}
                        >
                            <option value="">Pilih role...</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.role_id}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500 disabled:opacity-50 dark:bg-orange-500 dark:hover:bg-orange-600"
                        >
                            {processing ? 'Menyimpan...' : 'Tambah Pengguna'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface EditModalProps {
    open: boolean;
    onClose: () => void;
    item: UserItem;
    roles: RoleOption[];
    isSelf: boolean;
}

function EditModal({ open, onClose, item, roles, isSelf }: EditModalProps) {
    const form = useForm({
        role_id: String(item.role_id ?? ''),
        is_active: item.is_active,
    });

    form.transform((data) => ({
        ...data,
        role_id: Number(data.role_id),
    }));

    const { data, setData, put, processing, errors } = form;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/dashboard/user-management/${item.id}`, {
            onSuccess: onClose,
        });
    };

    if (!open) {
        return null;
    }

    const initials = item.name
        .split(' ')
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-300/60 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900">
                <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-white/10">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                        Edit Pengguna
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
                    <div className="flex items-center gap-3 rounded-xl border border-neutral-300/60 bg-neutral-100 px-4 py-3 dark:border-white/10 dark:bg-white/[.075]">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-sm font-bold text-orange-400 dark:bg-orange-400/20">
                            {initials}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate font-semibold text-neutral-800 dark:text-neutral-200">
                                {item.name}
                            </p>
                            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                                {item.email}
                            </p>
                        </div>
                    </div>

                    {isSelf && (
                        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400">
                            Ini akun Anda sendiri. Untuk keamanan, role dan
                            status akun Anda tidak dapat diubah dari halaman
                            ini.
                        </p>
                    )}

                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Role
                        </label>
                        <select
                            value={data.role_id}
                            disabled={isSelf}
                            onChange={(e) => setData('role_id', e.target.value)}
                            className={cn(
                                inputClass,
                                isSelf && 'cursor-not-allowed opacity-60',
                            )}
                        >
                            <option value="">Pilih role...</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.role_id}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is-active"
                            checked={data.is_active}
                            disabled={isSelf}
                            onChange={(e) =>
                                setData('is_active', e.target.checked)
                            }
                            className="size-4 rounded border-neutral-300 text-orange-400 focus:ring-orange-400/20 disabled:opacity-60 dark:border-neutral-700"
                        />
                        <label
                            htmlFor="is-active"
                            className={cn(
                                'text-sm font-medium',
                                isSelf
                                    ? 'cursor-not-allowed text-neutral-400 dark:text-neutral-500'
                                    : 'text-neutral-700 dark:text-neutral-300',
                            )}
                        >
                            Akun aktif (nonaktifkan untuk memblokir akses)
                        </label>
                    </div>
                    {errors.is_active && (
                        <p className="text-xs text-red-500">{errors.is_active}</p>
                    )}

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing || isSelf}
                            className="flex-1 rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500 disabled:opacity-50 dark:bg-orange-500 dark:hover:bg-orange-600"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Users({ users, roles }: UsersProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editItem, setEditItem] = useState<UserItem | null>(null);

    const { auth } = usePage().props as {
        auth: { user: { id: number } | null };
    };
    const currentUserId = auth.user?.id;

    const columns: ColumnDef<UserItem>[] = [
        {
            accessorKey: 'name',
            header: 'Pengguna',
            cell: ({ row }) => {
                const initials = row.original.name
                    .split(' ')
                    .slice(0, 2)
                    .map((part) => part.charAt(0))
                    .join('')
                    .toUpperCase();

                return (
                    <span className="inline-flex items-center gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-xs text-orange-400 dark:bg-orange-400/20">
                            {initials}
                        </span>
                        <span>{row.original.name}</span>
                    </span>
                );
            },
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => (
                <span className="text-neutral-600 dark:text-neutral-400">
                    {row.original.email}
                </span>
            ),
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => <RoleBadge role={row.original.role} />,
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => <StatusBadge active={row.original.is_active} />,
        },
        {
            accessorKey: 'email_verified_at',
            header: 'Verifikasi Email',
            cell: ({ row }) =>
                row.original.email_verified_at ? (
                    <Badge className="border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        Terverifikasi
                    </Badge>
                ) : (
                    <Badge className="border-transparent bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                        Belum
                    </Badge>
                ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            enableHiding: false,
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => setEditItem(row.original)}
                        className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        title="Edit"
                    >
                        <Pencil className="size-3.5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Manajemen User" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 items-center justify-center rounded-full bg-orange-400/10 dark:bg-orange-400/20">
                                <UserCog className="size-7 text-orange-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                                    Manajemen User & Role
                                </h1>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Kelola akun pengguna, peran, dan status akses
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                            <UsersRound className="size-4 text-orange-400" />
                            {users.length} pengguna terdaftar
                        </div>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={users}
                    title="Daftar Pengguna"
                    subtitle={`${users.length} akun pengguna`}
                    searchPlaceholder="Cari nama, email, atau role..."
                    emptyState="Belum ada pengguna yang terdaftar."
                    toolbarActions={
                        <button
                            type="button"
                            onClick={() => setCreateOpen(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                        >
                            <Plus className="size-4" />
                            Tambah Pengguna
                        </button>
                    }
                />
            </div>

            <CreateModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                roles={roles}
            />

            {editItem && (
                <EditModal
                    key={editItem.id}
                    open
                    onClose={() => setEditItem(null)}
                    item={editItem}
                    roles={roles}
                    isSelf={editItem.id === currentUserId}
                />
            )}
        </>
    );
}

Users.layout = {
    breadcrumbs: [
        {
            title: 'Manajemen User',
            href: '/dashboard/user-management',
        },
    ],
};