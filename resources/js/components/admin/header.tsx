import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
    fixed?: boolean;
    ref?: React.Ref<HTMLElement>;
};

export function AdminHeader({
    className,
    fixed,
    children,
    ...props
}: HeaderProps) {
    return (
        <header
            data-slot="admin-header"
            className={cn(
                'relative z-50 flex h-16 w-full shrink-0 items-center gap-3 border-b border-sidebar-border/80 bg-background p-4 sm:gap-4',
                fixed && 'sticky top-0',
                className,
            )}
            {...props}
        >
            <SidebarTrigger variant="outline" className="max-md:scale-125" />
            <Separator orientation="vertical" className="h-6" />
            {children}
        </header>
    );
}
