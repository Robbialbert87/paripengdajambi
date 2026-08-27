import * as React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

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

        const itemVariants = {
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

                    {/* Fan Layout Container */}
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
                            const maxDist = centerIndex;
                            const zIndex = members.length - dist;

                            return (
                                <motion.div
                                    key={member.name}
                                    className="absolute w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-xl overflow-hidden shadow-lg border-2 border-yellow-100/60 dark:border-neutral-600/60"
                                    custom={index}
                                    variants={itemVariants}
                                    style={{ zIndex }}
                                    whileHover={{
                                        scale: 1.15,
                                        zIndex: 99,
                                        transition: { type: 'spring', stiffness: 300, damping: 20 },
                                    }}
                                >
                                    {/* Avatar with initials */}
                                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center dark:from-orange-500 dark:to-orange-600">
                                        <span className="text-white font-bold text-base sm:text-xl lg:text-2xl">
                                            {member.initials}
                                        </span>
                                    </div>

                                    {/* Name label */}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1 py-1.5 sm:px-2 sm:py-2">
                                        <p className="text-[8px] font-semibold leading-tight text-white sm:text-[10px] lg:text-xs">
                                            {member.name}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>
        );
    },
);

AnimatedTeamSection.displayName = 'AnimatedTeamSection';

export { AnimatedTeamSection };
