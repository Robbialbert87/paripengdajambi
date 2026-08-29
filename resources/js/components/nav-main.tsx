import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavGroup, NavItem } from '@/types';

function NavLink({ item }: { item: NavItem }) {
    const { isCurrentUrl } = useCurrentUrl();

    if (item.disabled) {
        return (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                    disabled
                    tooltip={{ children: item.title }}
                    className="cursor-default"
                >
                    {item.icon && <item.icon />}
                    <span className="flex-1">{item.title}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                        Segera Hadir
                    </span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    return (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
                asChild
                isActive={isCurrentUrl(item.href)}
                tooltip={{ children: item.title }}
            >
                <Link href={item.href} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export function NavMain({
    dashboardItem,
    groups = [],
}: {
    dashboardItem?: NavItem;
    groups?: NavGroup[];
}) {
    return (
        <>
            {dashboardItem && (
                <SidebarGroup className="px-2 py-0">
                    <SidebarMenu>
                        <NavLink item={dashboardItem} />
                    </SidebarMenu>
                </SidebarGroup>
            )}

            {groups.map((group, index) => (
                <SidebarGroup
                    key={group.title}
                    className={`px-2 py-0 ${index > 0 ? 'mt-4' : ''}`}
                >
                    <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-orange-400/90">
                        {group.title}
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {group.items.map((item) => (
                            <NavLink key={item.title} item={item} />
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}