import { Link, usePage } from '@inertiajs/react';

import { useLayout } from '@/components/admin/layout-provider';
import { NavGroup } from '@/components/admin/nav-group';
import { NavUser } from '@/components/admin/nav-user';
import { useAdminNav } from '@/components/admin/use-admin-nav';
import AppLogo from '@/components/app-logo';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { User } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props as {
        auth: { user?: User | null };
    };
    const { dashboardItem, groups } = useAdminNav();
    const { collapsible, variant } = useLayout();

    const user = auth.user;

    return (
        <Sidebar collapsible={collapsible} variant={variant}>
            <SidebarHeader className="p-0">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-16 justify-start px-4"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-1">
                <NavGroup title="Utama" items={[dashboardItem]} />
                {groups.map((group) => (
                    <NavGroup
                        key={group.title}
                        title={group.title}
                        items={group.items}
                    />
                ))}
            </SidebarContent>

            <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
