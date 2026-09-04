import { AdminFooter } from '@/components/admin/footer';
import { SkipToMain } from '@/components/admin/skip-to-main';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <SkipToMain />
            <AppSidebar />
            <AppContent
                variant="sidebar"
                className="min-w-0 overflow-x-clip"
                id="content"
            >
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="flex flex-1 flex-col">{children}</div>
                <AdminFooter />
            </AppContent>
        </AppShell>
    );
}
