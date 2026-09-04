import { cn } from '@/lib/utils';

type FooterProps = React.ComponentProps<'footer'>;

const appName =
    (typeof window !== 'undefined' ? document.title.split(' - ')[0] : '') ||
    'PARI Pengda Jambi';

export function AdminFooter({ className, ...props }: FooterProps) {
    return (
        <footer
            className={cn(
                'mt-auto shrink-0 border-t px-4 py-4 text-center text-sm text-muted-foreground',
                className,
            )}
            {...props}
        >
            <span>
                &copy; {new Date().getFullYear()} {appName} — Seluruh hak cipta
                dilindungi
            </span>
        </footer>
    );
}
