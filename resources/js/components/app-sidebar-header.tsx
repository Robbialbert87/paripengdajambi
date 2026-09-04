import { Link, usePage } from '@inertiajs/react';
import { Bell, ChevronsUpDown } from 'lucide-react';

import { ConfigDrawer } from '@/components/admin/config-drawer';
import { AdminHeader } from '@/components/admin/header';
import { AdminSearch } from '@/components/admin/search';
import { ThemeSwitch } from '@/components/admin/theme-switch';
import { Breadcrumbs } from '@/components/breadcrumbs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { verifikasi } from '@/routes/dashboard';
import type { BreadcrumbItem as BreadcrumbItemType, User } from '@/types';

const ADMIN = 'admin';
const VERIFIKASI_PERMISSION = 'verifikasi-anggota';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth, pendingVerifications } = usePage().props as {
        auth: { user?: User | null };
        pendingVerifications?: number;
    };

    const user = auth.user;
    const role = user?.role as
        { slug?: string; permissions?: string[] } | undefined;
    const canVerifikasi =
        !!user &&
        (role?.slug === ADMIN ||
            (role?.permissions ?? []).includes(VERIFIKASI_PERMISSION));

    return (
        <AdminHeader fixed>
            <div className="hidden min-w-0 md:block">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="ms-2 flex min-w-0 flex-1 justify-end">
                <AdminSearch />
            </div>

            <div className="ml-auto flex items-center gap-1.5">
                {user && canVerifikasi && (
                    <Link
                        href={verifikasi()}
                        prefetch
                        title="Verifikasi Anggota"
                        className="relative rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                    >
                        <Bell className="size-5" />
                        {(pendingVerifications ?? 0) > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                                {pendingVerifications}
                            </span>
                        )}
                    </Link>
                )}

                <ThemeSwitch />
                <ConfigDrawer />

                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="rounded-full p-1 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                <UserInfo user={user} hideNameOnMobile />
                                <ChevronsUpDown className="hidden size-4 shrink-0 text-neutral-400 sm:block" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            align="end"
                        >
                            <UserMenuContent user={user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </AdminHeader>
    );
}
