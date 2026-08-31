import {
    BookOpen,
    ClipboardList,
    GraduationCap,
    Monitor,
    Scale,
    Users,
    Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type StrukturIconKey =
    | 'clipboard-list'
    | 'scale'
    | 'graduation-cap'
    | 'monitor'
    | 'wallet'
    | 'book-open'
    | 'users';

export const strukturIconMap: Record<StrukturIconKey, LucideIcon> = {
    'clipboard-list': ClipboardList,
    scale: Scale,
    'graduation-cap': GraduationCap,
    monitor: Monitor,
    wallet: Wallet,
    'book-open': BookOpen,
    users: Users,
};

export const strukturIconKeys = Object.keys(
    strukturIconMap,
) as StrukturIconKey[];

export const strukturIconLabels: Record<StrukturIconKey, string> = {
    'clipboard-list': 'Sekretariat',
    scale: 'Hukum',
    'graduation-cap': 'Kaderisasi',
    monitor: 'IT & Humas',
    wallet: 'Keuangan',
    'book-open': 'Diklat',
    users: 'Kesra',
};
