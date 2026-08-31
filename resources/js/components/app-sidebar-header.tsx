import { Link, usePage } from '@inertiajs/react';
import { Bell, ChevronsUpDown } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
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
        <header className="sticky top-0 z-30 flex h-[70px] shrink-0 items-center gap-2 border-b border-[#e7eaf0] bg-white/95 px-4 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 md:px-6 dark:border-neutral-800 dark:bg-neutral-900/95">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
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
                            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1e84c4] px-1 text-[10px] font-bold text-white">
                                {pendingVerifications}
                            </span>
                        )}
                    </Link>
                )}

                {user && (
                    <>
                        <Separator
                            orientation="vertical"
                            className="mx-1 hidden h-6 sm:block"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="flex max-w-56 items-center gap-2 rounded-lg px-2 py-1.5 text-left transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                    <UserInfo user={user} />
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
                    </>
                )}
            </div>
        </header>
    );
}
