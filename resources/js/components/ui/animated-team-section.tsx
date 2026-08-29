import * as React from 'react';
import { motion, useAnimation, AnimatePresence, type Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';

interface TeamMember {
    name: string;
    initials: string;
    foto?: string | null;
}

export interface AnimatedTeamSectionProps {
    title: string;
    description: string;
    members: TeamMember[];
    className?: string;
}

function useResponsiveSpacing() {
    const [spacing, setSpacing] = React.useState({ x: 90, y: -30, rotate: 12 });

    React.useEffect(() => {
        const update = () => {
            if (window.innerWidth < 768) {
                setSpacing({ x: 32, y: -14, rotate: 6 });
            } else if (window.innerWidth < 1024) {
                setSpacing({ x: 70, y: -25, rotate: 10 });
            } else {
                setSpacing({ x: 90, y: -30, rotate: 12 });
            }
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return spacing;
}

const AnimatedTeamSection = React.forwardRef<HTMLDivElement, AnimatedTeamSectionProps>(
    ({ title, description, members, className, ...props }, ref) => {
        const controls = useAnimation();
        const [inViewRef, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
        const spacing = useResponsiveSpacing();
        const isMobile = useIsMobile();
        const [selected, setSelected] = React.useState<string | null>(null);

        React.useEffect(() => {
            if (inView) controls.start('visible');
        }, [controls, inView]);

        const selectedMember = members.find((m) => m.name === selected) ?? null;

        const getCardState = (index: number, total: number) => {
            const centerIndex = (total - 1) / 2;
            const distanceFromCenter = index - centerIndex;
            return {
                x: distanceFromCenter * spacing.x,
                y: Math.abs(distanceFromCenter) * spacing.y,
                rotate: distanceFromCenter * spacing.rotate,
            };
        };

        const containerVariants = {
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
        };

        const fanItemVariants: Variants = {
            hidden: { opacity: 0, scale: 0.5, x: 0, y: 0, rotate: 0 },
            visible: (i: number) => ({
                opacity: 1,
                scale: 1,
                x: getCardState(i, members.length).x,
                y: getCardState(i, members.length).y,
                rotate: getCardState(i, members.length).rotate,
                transition: { type: 'spring', stiffness: 120, damping: 12 },
            }),
        };

        const isSelected = (name: string) => selected === name;

        return (
            <section ref={ref} className={cn('w-full py-12 lg:py-16 overflow-hidden', className)} {...props}>
                <div className="container mx-auto flex flex-col items-center text-center px-4">
                    {/* Section Header */}
                    <h2 className="text-xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200 sm:text-2xl">
                        {title}
                    </h2>
                    {description && (
                        <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
                            {description}
                        </p>
                    )}
                    {isMobile && (
                        <p className="mt-2 text-[11px] text-neutral-400 dark:text-neutral-500">
                            Sentuh card untuk melihat nama lengkap
                        </p>
                    )}

                    {/* Fan Layout */}
                    <motion.div
                        ref={inViewRef}
                        className="relative mt-10 flex items-center justify-center sm:mt-16"
                        style={{ minHeight: isMobile ? '160px' : '220px' }}
                        variants={containerVariants}
                        initial="hidden"
                        animate={controls}
                    >
                        {members.map((member, index) => {
                            const centerIndex = (members.length - 1) / 2;
                            const dist = Math.abs(index - centerIndex);
                            const zIndex = isSelected(member.name) ? 99 : members.length - dist;

                            return (
                                <motion.div
                                    key={member.name}
                                    className={cn(
                                        'absolute h-16 w-16 overflow-hidden rounded-xl shadow-lg border-2 sm:h-24 sm:w-24 lg:h-36 lg:w-36 transition-colors duration-200',
                                        isSelected(member.name)
                                            ? 'border-orange-400 dark:border-orange-400'
                                            : 'border-neutral-300/60 dark:border-neutral-600/60',
                                    )}
                                    custom={index}
                                    variants={fanItemVariants}
                                    whileHover={{ scale: 1.15, zIndex: 99 }}
                                    whileTap={{ scale: 0.9, zIndex: 99 }}
                                    animate={
                                        isSelected(member.name)
                                            ? { scale: 1.12, zIndex: 99 }
                                            : { scale: 1 }
                                    }
                                    style={{ zIndex }}
                                    onClick={() =>
                                        setSelected(isSelected(member.name) ? null : member.name)
                                    }
                                    role="button"
                                    aria-pressed={isSelected(member.name)}
                                >
                                    {/* Avatar with initials */}
                                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-orange-400 to-orange-500 dark:from-orange-500 dark:to-orange-600">
                                        {member.foto ? (
                                            <img
                                                src={member.foto}
                                                alt={member.name}
                                                loading="lazy"
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="font-bold text-white text-sm sm:text-lg lg:text-2xl">
                                                {member.initials}
                                            </span>
                                        )}
                                        {/* Selected ring overlay */}
                                        {isSelected(member.name) && (
                                            <div className="pointer-events-none absolute inset-0 rounded-[10px] ring-2 ring-inset ring-orange-400 dark:ring-orange-400" />
                                        )}
                                    </div>

                                    {/* Name label */}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1 py-1 sm:px-2 sm:py-2">
                                        <p className="text-[7px] font-semibold leading-tight text-white sm:text-[10px] lg:text-xs">
                                            {member.name}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Selected member banner */}
                    <AnimatePresence mode="wait">
                        {selectedMember && (
                            <motion.div
                                key={selectedMember.name}
                                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className="mt-6 flex items-center gap-3 rounded-xl border border-orange-200/60 bg-orange-50/70 px-5 py-3 shadow-md backdrop-blur-sm dark:border-orange-800/40 dark:bg-orange-900/20"
                            >
                                <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-orange-500 font-bold text-white dark:from-orange-500 dark:to-orange-600 sm:size-12">
                                        {selectedMember.foto ? (
                                            <img
                                                src={selectedMember.foto}
                                                alt={selectedMember.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-sm">{selectedMember.initials}</span>
                                        )}
                                    </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                        {selectedMember.name}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="ml-2 flex size-7 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-orange-100 hover:text-orange-500 dark:hover:bg-orange-900/30"
                                    aria-label="Tutup"
                                >
                                    <X className="size-4" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        );
    },
);

AnimatedTeamSection.displayName = 'AnimatedTeamSection';

export { AnimatedTeamSection };