import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

/* ─── Types ────────────────────────────────────────────────────────────────── */

interface DepartmentMember {
    name: string;
    initials: string;
    foto?: string | null;
}

interface DepartmentData {
    name: string;
    icon: LucideIcon;
    chairman?: DepartmentMember | null;
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
    const [isExpanded, setIsExpanded] = useState(false);
    const Icon = dept.icon;
    const hasMembers = dept.members.length > 0;

    return (
        <div
            className="group flex flex-col overflow-hidden rounded-xl border border-yellow-100/40 bg-yellow-50/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-700/40 dark:bg-neutral-800/80"
        >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-yellow-100/40 px-4 py-3 dark:border-neutral-700/40">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <Icon className="size-4 text-orange-500 dark:text-orange-400" />
                </div>
                <h4 className="flex-1 text-sm font-bold leading-tight text-neutral-800 dark:text-neutral-200">
                    {dept.name}
                </h4>
                {hasMembers && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="flex size-7 items-center justify-center rounded-full transition-colors hover:bg-orange-100 dark:hover:bg-orange-900/30"
                        aria-label={isExpanded ? 'Sembunyikan anggota' : 'Tampilkan anggota'}
                    >
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        >
                            <ChevronDown className="size-4 text-orange-500" />
                        </motion.div>
                    </button>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-col items-center p-6">
                {dept.chairman ? (
                    <>
                        {/* Avatar */}
                        <div className="mb-3 flex size-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-md dark:from-orange-500 dark:to-orange-600">
                            {dept.chairman.foto ? (
                                <img
                                    src={dept.chairman.foto}
                                    alt={dept.chairman.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-white">{dept.chairman.initials}</span>
                            )}
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
                            {dept.members.length} Anggota terdaftar
                        </p>
                    </div>
                )}
            </div>

            {/* Expandable Members Section */}
            <AnimatePresence initial={false}>
                {isExpanded && hasMembers && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: { type: 'spring', stiffness: 400, damping: 35 },
                            opacity: { duration: 0.2, delay: 0.05 },
                        }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-dashed border-orange-200 px-4 pb-5 pt-4 dark:border-orange-800/40">
                            <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-wider text-orange-400">
                                Anggota ({dept.members.length})
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {dept.members.map((member, i) => (
                                    <motion.div
                                        key={member.name}
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{
                                            delay: i * 0.08,
                                            type: 'spring',
                                            stiffness: 250,
                                            damping: 22,
                                        }}
                                        className="flex w-[calc(50%-4px)] flex-col items-center gap-1.5 rounded-lg p-2.5 transition-all duration-200 hover:scale-105 hover:bg-orange-50/60 sm:flex-1 sm:w-auto dark:hover:bg-orange-900/10"
                                        title={member.name}
                                    >
                                        <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-md dark:from-orange-500 dark:to-orange-600 sm:size-14">
                                            {member.foto ? (
                                                <img
                                                    src={member.foto}
                                                    alt={member.name}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs font-bold text-white sm:text-sm">
                                                    {member.initials}
                                                </span>
                                            )}
                                        </div>
                                        <p className="max-w-[90px] truncate text-center text-[10px] font-medium leading-tight text-neutral-600 dark:text-neutral-400 sm:text-[11px]">
                                            {member.name}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
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
            <div className="flex flex-wrap justify-center gap-4">
                <AnimatePresence mode="popLayout">
                    {filtered.map((dept, i) => (
                        <motion.div
                            key={dept.name}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 250,
                                damping: 22,
                                delay: i * 0.06,
                            }}
                            style={{ position: 'relative' }}
                            className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
                        >
                            <DepartmentCard dept={dept} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
};
