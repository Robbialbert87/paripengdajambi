import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
    submitted:
        'border-transparent bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400',
    under_review:
        'border-transparent bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    revision:
        'border-transparent bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400',
    approved:
        'border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    rejected:
        'border-transparent bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
    draft: 'border-transparent bg-neutral-200/70 text-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-400',
};

export function StatusBadge({
    status,
    label,
}: {
    status: string;
    label: string;
}) {
    return (
        <Badge
            className={cn(
                'border-transparent',
                statusStyles[status] ?? statusStyles.draft,
            )}
        >
            {label}
        </Badge>
    );
}
