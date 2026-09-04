import type { InertiaLinkProps } from '@inertiajs/react';

export type NavUser = {
    name: string;
    email: string;
    avatar?: string;
};

export type NavTeam = {
    name: string;
    plan?: string;
};

export type BaseNavItem = {
    title: string;
    badge?: string;
    icon?: React.ElementType;
    disabled?: boolean;
};

export type Href = NonNullable<InertiaLinkProps['href']>;

export type NavLink = BaseNavItem & {
    href: Href;
    items?: never;
};

export type NavCollapsible = BaseNavItem & {
    items: (BaseNavItem & { href: Href })[];
    href?: never;
};

export type NavItem = NavCollapsible | NavLink;

export type NavGroup = {
    title: string;
    items: NavItem[];
};
