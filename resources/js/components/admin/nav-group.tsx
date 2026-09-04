import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import type {
    Href,
    NavCollapsible,
    NavGroup as NavGroupProps,
    NavItem,
    NavLink,
} from '@/components/admin/sidebar-types';
import { Badge } from '@/components/ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';

export function NavGroup({ title, items }: NavGroupProps) {
    const { state, isMobile } = useSidebar();
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="h-9 px-3 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                {title}
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const key = `${item.title}-${item.href ?? ''}`;

                    if (!item.items) {
                        return (
                            <SidebarMenuLink
                                key={key}
                                item={item}
                                isActive={isCurrentUrl(item.href)}
                            />
                        );
                    }

                    if (state === 'collapsed' && !isMobile) {
                        return (
                            <SidebarMenuCollapsedDropdown
                                key={key}
                                item={item}
                                isActive={isCurrentOrParentUrl(
                                    item.items[0]?.href ?? '',
                                )}
                            />
                        );
                    }

                    return (
                        <SidebarMenuCollapsible
                            key={key}
                            item={item}
                            isActive={isCurrentOrParentUrl(
                                item.items[0]?.href ?? '',
                            )}
                            isActiveSub={isCurrentUrl}
                        />
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

function NavBadge({ children }: { children: React.ReactNode }) {
    return <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>;
}

function SidebarMenuLink({
    item,
    isActive,
}: {
    item: NavLink;
    isActive: boolean;
}) {
    const { setOpenMobile } = useSidebar();

    if (item.disabled) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton
                    disabled
                    tooltip={item.title}
                    className="h-auto gap-3 rounded-lg px-3 py-2 leading-none [&>svg]:size-[18px]"
                >
                    {item.icon && <item.icon />}
                    <span className="flex-1 text-sm">{item.title}</span>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-neutral-400 uppercase dark:bg-neutral-800 dark:text-neutral-500">
                        Segera Hadir
                    </span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.title}
                className="h-auto gap-3 rounded-lg px-3 py-2 text-sm leading-none hover:font-medium data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground [&>svg]:size-[18px]"
            >
                <Link
                    href={item.href}
                    prefetch
                    onClick={() => setOpenMobile(false)}
                >
                    {item.icon && <item.icon />}
                    <span className="flex-1">{item.title}</span>
                    {item.badge && <NavBadge>{item.badge}</NavBadge>}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function SidebarMenuCollapsible({
    item,
    isActive,
    isActiveSub,
}: {
    item: NavCollapsible;
    isActive: boolean;
    isActiveSub: (href: Href) => boolean;
}) {
    const { setOpenMobile } = useSidebar();

    return (
        <Collapsible
            asChild
            defaultOpen={isActive}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        tooltip={item.title}
                        className="h-auto gap-3 rounded-lg px-3 py-2 text-sm leading-none [&>svg]:size-[18px]"
                    >
                        {item.icon && <item.icon />}
                        <span className="flex-1">{item.title}</span>
                        {item.badge && <NavBadge>{item.badge}</NavBadge>}
                        <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent">
                    <SidebarMenuSub>
                        {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={isActiveSub(subItem.href)}
                                >
                                    <Link
                                        href={subItem.href}
                                        onClick={() => setOpenMobile(false)}
                                    >
                                        {subItem.icon && <subItem.icon />}
                                        <span>{subItem.title}</span>
                                        {subItem.badge && (
                                            <NavBadge>{subItem.badge}</NavBadge>
                                        )}
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}

function SidebarMenuCollapsedDropdown({
    item,
    isActive,
}: {
    item: NavCollapsible;
    isActive: boolean;
}) {
    const { setOpenMobile } = useSidebar();

    return (
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                        className="h-auto gap-3 rounded-lg px-3 py-2 text-sm leading-none [&>svg]:size-[18px]"
                    >
                        {item.icon && <item.icon />}
                        <span className="flex-1">{item.title}</span>
                        {item.badge && <NavBadge>{item.badge}</NavBadge>}
                        <ChevronRight className="ms-auto transition-transform duration-200" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" sideOffset={4}>
                    <DropdownMenuLabel>
                        {item.title}
                        {item.badge ? ` (${item.badge})` : ''}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {item.items.map((sub) => (
                        <DropdownMenuItem
                            key={`${sub.title}-${sub.href}`}
                            asChild
                        >
                            <Link
                                href={sub.href}
                                onClick={() => setOpenMobile(false)}
                            >
                                {sub.icon && <sub.icon />}
                                <span className="max-w-52 text-wrap">
                                    {sub.title}
                                </span>
                                {sub.badge && (
                                    <span className="ms-auto text-xs">
                                        {sub.badge}
                                    </span>
                                )}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
}

export type { NavItem };
