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
                    className="h-auto gap-3 rounded-[5px] px-[17px] py-2.5 leading-none [&>svg]:size-[18px]"
                >
                    {item.icon && <item.icon />}
                    <span className="flex-1">{item.title}</span>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-neutral-400 uppercase dark:bg-neutral-800 dark:text-neutral-500">
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
                className="h-auto gap-3 rounded-[5px] px-[17px] py-2.5 text-[15px] leading-none hover:font-medium data-[active=true]:text-sidebar-accent-foreground [&>svg]:size-[18px]"
            >
                <Link href={item.href} prefetch>
                    {item.icon && <item.icon />}
                    <span className="flex-1">{item.title}</span>
                    {item.badge !== undefined && (
                        <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-[#1bb394] px-1.5 py-0.5 text-[10px] font-bold text-white tabular-nums group-data-[collapsible=icon]:hidden">
                            {item.badge}
                        </span>
                    )}
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

            {groups.map((group) => (
                <SidebarGroup key={group.title} className="px-2 py-0">
                    <SidebarGroupLabel className="h-9 px-5 text-[11px] font-semibold tracking-[0.05em] text-sidebar-foreground/60 uppercase">
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
