import * as React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface TeamMember {
    name: string;
    initials: string;
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
            if (window.innerWidth < 640) {
                setSpacing({ x: 52, y: -18, rotate: 8 });
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

        React.useEffect(() => {
            if (inView) controls.start('visible');
        }, [controls, inView]);

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

        const fanItemVariants = {
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

        const bandItemVariants = {
            hidden: { opacity: 0, scale: 0.5, y: 20 },
            visible: {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { type: 'spring', stiffness: 120, damping: 12 },
            },
        };

        const renderCardContent = (member: TeamMember, initialsClass: string, nameClass: string) => (
            <>
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-400 to-orange-500 dark:from-orange-500 dark:to-orange-600">
                    <span className={cn('font-bold text-white', initialsClass)}>
                        {member.initials}
                    </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2">
                    <p className={cn('font-semibold leading-tight text-white', nameClass)}>
                        {member.name}
                    </p>
                </div>
            </>
        );

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

                    {isMobile ? (
                        /* ── Mobile: Swipeable Band ──────────────────── */
                        <motion.div
                            ref={inViewRef}
                            className="relative mt-8 w-full"
                            variants={containerVariants}
                            initial="hidden"
                            animate={controls}
                        >
                            <div className="ml-auto mr-auto flex w-full gap-4 overflow-x-auto scroll-smooth px-8 pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
                                {members.map((member) => (
                                    <motion.div
                                        key={member.name}
                                        variants={bandItemVariants}
                                        className="relative w-44 shrink-0 snap-center overflow-hidden rounded-xl shadow-lg border-2 border-yellow-100/60 dark:border-neutral-600/60"
                                    >
                                        <div className="h-44">
                                            {renderCardContent(member, 'text-2xl', 'text-xs')}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                                Geser untuk melihat semua
                            </p>
                        </motion.div>
                    ) : (
                        /* ── Desktop/Tablet: Fan Layout ──────────────── */
                        <motion.div
                            ref={inViewRef}
                            className="relative mt-12 flex items-center justify-center sm:mt-16"
                            style={{ minHeight: '220px' }}
                            variants={containerVariants}
                            initial="hidden"
                            animate={controls}
                        >
                            {members.map((member, index) => {
                                const centerIndex = (members.length - 1) / 2;
                                const dist = Math.abs(index - centerIndex);
                                const zIndex = members.length - dist;

                                return (
                                    <motion.div
                                        key={member.name}
                                        className="absolute h-20 w-20 overflow-hidden rounded-xl shadow-lg border-2 border-yellow-100/60 dark:border-neutral-600/60 sm:h-28 sm:w-28 lg:h-36 lg:w-36"
                                        custom={index}
                                        variants={fanItemVariants}
                                        style={{ zIndex }}
                                        whileHover={{
                                            scale: 1.15,
                                            zIndex: 99,
                                            transition: { type: 'spring', stiffness: 300, damping: 20 },
                                        }}
                                    >
                                        {renderCardContent(member, 'text-base sm:text-xl lg:text-2xl', 'text-[8px] sm:text-[10px] lg:text-xs')}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </div>
            </section>
        );
    },
);

AnimatedTeamSection.displayName = 'AnimatedTeamSection';

export { AnimatedTeamSection };