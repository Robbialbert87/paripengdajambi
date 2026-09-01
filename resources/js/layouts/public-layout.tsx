import PublicFooter from '@/components/public-footer';
import PublicNavbar from '@/components/public-navbar';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col overflow-x-clip bg-neutral-200 selection:bg-yellow-400 selection:text-neutral-700 dark:bg-neutral-800">
            <div className="mx-auto w-full max-w-screen-2xl grow px-4 sm:px-6 lg:px-8">
                <PublicNavbar />
                <main>{children}</main>
            </div>
            <PublicFooter />
        </div>
    );
}
