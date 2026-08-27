import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

/* ─── Types ────────────────────────────────────────────────────────────────── */

interface DepartmentMember {
    name: string;
    initials: string;
}

interface DepartmentData {
    name: string;
    icon: LucideIcon;
    chairman?: DepartmentMember;
    members: DepartmentMember[];
}

interface DepartmentSectionProps {
    departments: DepartmentData[];
    className?: string;
}

/* ─── Short names for filter buttons ───────────────────────────────────────── */

function getShortName(name: string): string {
    const map: Record<string, string> = {
        'Bid. Sekretariat': 'Sekretariat',
        'Bid. Advokasi Hukum dan Organisasi': 'Advokasi Hukum',
        'Bid. Kaderisasi dan Pengembangan Profesi': 'Kaderisasi',
        'Bid. IT dan Humas': 'IT & Humas',
        'Bid. Bendahara': 'Bendahara',
        'Bid. Diklat dan Pelatihan': 'Diklat',
        'Bid. Kesra dan Pengabdian Masyarakat': 'Kesra',
    };
    return map[name] ?? name;
}

/* ─── Card Component ───────────────────────────────────────────────────────── */

function DepartmentCard({ dept }: { dept: DepartmentData }) {
    const Icon = dept.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="group flex flex-col overflow-hidden rounded-xl border border-yellow-100/40 bg-yellow-50/60 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-700/40 dark:bg-neutral-800/80"
        >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-yellow-100/40 px-4 py-3 dark:border-neutral-700/40">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <Icon className="size-4 text-orange-500 dark:text-orange-400" />
                </div>
                <h4 className="text-sm font-bold leading-tight text-neutral-800 dark:text-neutral-200">
                    {dept.name}
                </h4>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center p-6">
                {dept.chairman ? (
                    <>
                        {/* Avatar */}
                        <div className="mb-3 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-md dark:from-orange-500 dark:to-orange-600">
                            <span className="text-2xl font-bold text-white">{dept.chairman.initials}</span>
                        </div>
                        {/* Name */}
                        <p className="text-center text-sm font-bold text-neutral-800 dark:text-neutral-200">
                            {dept.chairman.name}
                        </p>
                        <p className="mt-0.5 text-center text-xs text-orange-400">Ketua</p>
                    </>
                ) : (
                    <div className="flex flex-col items-center py-4">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            3 Anggota terdaftar
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

/* ─── Main Component ───────────────────────────────────────────────────────── */

export const DepartmentSection = ({ departments, className }: DepartmentSectionProps) => {
    const [activeFilter, setActiveFilter] = useState('Semua Bidang');

    const filtered = activeFilter === 'Semua Bidang'
        ? departments
        : departments.filter((d) => d.name === activeFilter);

    return (
        <section className={cn('w-full', className)}>
            {/* Filter Buttons */}
            <div className="mb-6 flex flex-wrap justify-center gap-2">
                <button
                    onClick={() => setActiveFilter('Semua Bidang')}
                    className={cn(
                        'rounded-full px-4 py-2 text-xs font-semibold transition-colors',
                        activeFilter === 'Semua Bidang'
                            ? 'bg-orange-400 text-white shadow-md'
                            : 'bg-yellow-50/60 text-neutral-600 hover:bg-yellow-100 dark:bg-neutral-800/60 dark:text-neutral-400 dark:hover:bg-neutral-700',
                    )}
                >
                    Semua Bidang
                </button>
                {departments.map((dept) => (
                    <button
                        key={dept.name}
                        onClick={() => setActiveFilter(dept.name)}
                        className={cn(
                            'rounded-full px-4 py-2 text-xs font-semibold transition-colors',
                            activeFilter === dept.name
                                ? 'bg-orange-400 text-white shadow-md'
                                : 'bg-yellow-50/60 text-neutral-600 hover:bg-yellow-100 dark:bg-neutral-800/60 dark:text-neutral-400 dark:hover:bg-neutral-700',
                        )}
                    >
                        {getShortName(dept.name)}
                    </button>
                ))}
            </div>

            {/* Cards Grid */}
            <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AnimatePresence mode="popLayout">
                    {filtered.map((dept) => (
                        <DepartmentCard key={dept.name} dept={dept} />
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
};
