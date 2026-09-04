import type { ReactNode } from 'react';

import { FontProvider, useFont } from '@/components/admin/font-provider';
import { LayoutProvider } from '@/components/admin/layout-provider';
import { SearchProvider } from '@/components/admin/search-provider';
import { ThemeProvider } from '@/components/admin/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type Props = {
    children: ReactNode;
    variant?: AppVariant;
};

function SidebarShell({ children }: { children: ReactNode }) {
    const { font } = useFont();

    const fontClass =
        font === 'inter'
            ? 'font-inter'
            : font === 'manrope'
              ? 'font-manrope'
              : '';

    return (
        <SidebarProvider defaultOpen className={fontClass}>
            {children}
        </SidebarProvider>
    );
}

export function AppShell({ children, variant = 'sidebar' }: Props) {
    if (variant === 'header') {
        return (
            <LayoutProvider>
                <FontProvider>
                    <ThemeProvider>
                        <SearchProvider>
                            <div className="flex min-h-screen w-full flex-col">
                                {children}
                            </div>
                        </SearchProvider>
                    </ThemeProvider>
                </FontProvider>
            </LayoutProvider>
        );
    }

    return (
        <LayoutProvider>
            <FontProvider>
                <ThemeProvider>
                    <SearchProvider>
                        <SidebarShell>{children}</SidebarShell>
                    </SearchProvider>
                </ThemeProvider>
            </FontProvider>
        </LayoutProvider>
    );
}
