import { usePage } from '@inertiajs/react';

import {
    ADMIN,
    dashboardItem,
    navGroups,
    Permission,
} from '@/components/admin/nav-data';
import type { NavGroup } from '@/components/admin/sidebar-types';

type AuthProps = {
    auth: {
        user?: {
            role?: { slug?: string; permissions?: string[] } | null;
        } | null;
    };
    pendingVerifications?: number;
};

export function useAdminNav(): {
    dashboardItem: typeof dashboardItem;
    groups: NavGroup[];
} {
    const { auth, pendingVerifications } = usePage().props as AuthProps;

    const roleSlug = auth.user?.role?.slug ?? '';
    const rolePermissions = auth.user?.role?.permissions ?? [];

    const can = (permission?: string) =>
        !permission ||
        roleSlug === ADMIN ||
        rolePermissions.includes(permission);

    const groups = navGroups
        .filter(
            (group) =>
                (!group.role || group.role === roleSlug) &&
                group.items.some((item) => can(item.permission)),
        )
        .map<NavGroup>(({ title, items }) => ({
            title,
            items: items
                .filter((item) => can(item.permission))
                .map((item) =>
                    item.permission === Permission.verifikasi &&
                    pendingVerifications
                        ? { ...item, badge: String(pendingVerifications) }
                        : item,
                ),
        }));

    return { dashboardItem, groups };
}
