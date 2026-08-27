import { Head } from '@inertiajs/react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { AnimatedTeamSection } from '@/components/ui/animated-team-section';
import { DepartmentSection } from '@/components/ui/department-section';
import { Mail, Phone, Instagram, Users, type LucideIcon } from 'lucide-react';
import { strukturIconMap, type StrukturIconKey } from '@/lib/struktur-icons';

/* ─── Types ────────────────────────────────────────────────────────────────── */

interface Person {
    name: string;
    initials: string;
    foto?: string | null;
}

interface Department {
    icon_key: StrukturIconKey;
    chairman?: Person | null;
    members: Person[];
}

interface ContactPerson {
    name: string;
    phone: string;
}

interface StrukturOrganisasiProps {
    advisors: Person[];
    chairman: Person | null;
    departments: (Department & { name: string })[];
    contacts: ContactPerson[];
}

/* ─── Helper Components ────────────────────────────────────────────────────── */

function Avatar({ person, size = 'md' }: { person: Person; size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'size-10 text-xs',
        md: 'size-14 text-sm',
        lg: 'size-20 text-xl',
    };
    return (
        <div
            className={`flex ${sizeClasses[size]} shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-orange-500 font-bold text-white shadow-md dark:from-orange-500 dark:to-orange-600`}
        >
            {person.foto ? (
                <img
                    src={person.foto}
                    alt={person.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                />
            ) : (
                person.initials
            )}
        </div>
    );
}

function ConnectorLine() {
    return (
        <div className="flex justify-center py-2">
            <div className="h-8 w-px bg-gradient-to-b from-orange-300 to-orange-500 dark:from-orange-500 dark:to-orange-400" />
        </div>
    );
}

function HorizontalConnector() {
    return (
        <div className="flex items-center justify-center py-4">
            <div className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-orange-300 to-transparent dark:via-orange-600" />
        </div>
    );
}

/* ─── Card Components ──────────────────────────────────────────────────────── */

function ChairmanCard({ chairman }: { chairman: Person }) {
    return (
        <div className="mx-auto max-w-sm">
            <div className="group relative overflow-hidden rounded-2xl border-2 border-teal-300/50 bg-gradient-to-br from-yellow-50 to-white p-6 text-center shadow-lg shadow-teal-400/10 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-teal-600/40 dark:from-neutral-800 dark:to-neutral-900 dark:shadow-teal-500/10">
                <div className="absolute -right-8 -top-8 size-24 rounded-full bg-teal-400/10 dark:bg-teal-500/10" />
                <div className="absolute -bottom-6 -left-6 size-20 rounded-full bg-orange-400/10 dark:bg-orange-500/10" />
                <div className="relative">
                    <div className="mx-auto mb-3">
                        <Avatar person={chairman} size="lg" />
                    </div>
                    <span className="mb-2 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-bold tracking-wider text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                        KETUA UMUM
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-neutral-800 dark:text-neutral-200">
                        {chairman.name}
                    </h3>
                </div>
            </div>
        </div>
    );
}

function ContactSection({ contacts }: { contacts: ContactPerson[] }) {
    return (
        <div className="rounded-2xl border border-yellow-100/40 bg-yellow-50/60 p-6 backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-800/80">
            <h3 className="mb-4 text-lg font-bold text-neutral-800 dark:text-neutral-200">
                Contact Person
            </h3>

            {/* CP List */}
            <div className="mb-4 grid gap-2 sm:grid-cols-2">
                {contacts.map((cp, i) => (
                    <div
                        key={`${cp.name}-${i}`}
                        className="flex items-center gap-3 rounded-lg bg-white/60 px-3 py-2 dark:bg-neutral-700/30"
                    >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <Phone className="size-3.5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                                {cp.name}
                            </p>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                {cp.phone}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Email & IG */}
            <div className="flex flex-col gap-2 sm:flex-row">
                <a
                    href="mailto:sekretariatparijambi@gmail.com"
                    className="flex items-center gap-2 rounded-lg bg-white/60 px-3 py-2 transition-colors hover:bg-orange-50 dark:bg-neutral-700/30 dark:hover:bg-orange-900/10"
                >
                    <Mail className="size-4 text-orange-400" />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        sekretariatparijambi@gmail.com
                    </span>
                </a>
                <a
                    href="https://instagram.com/paripengdajambi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-white/60 px-3 py-2 transition-colors hover:bg-orange-50 dark:bg-neutral-700/30 dark:hover:bg-orange-900/10"
                >
                    <Instagram className="size-4 text-orange-400" />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">@paripengdajambi</span>
                </a>
            </div>
        </div>
    );
}

/* ─── Main Page ────────────────────────────────────────────────────────────── */

export default function StrukturOrganisasi({
    advisors,
    chairman,
    departments,
    contacts,
}: StrukturOrganisasiProps) {
    const { ref: sectionRef, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

    const preparedDepartments: { name: string; icon: LucideIcon; chairman?: Person | null; members: Person[] }[] =
        departments.map((dept) => ({
            name: dept.name,
            icon: strukturIconMap[dept.icon_key] ?? Users,
            chairman: dept.chairman ?? null,
            members: dept.members,
        }));

    return (
        <>
            <Head title="Struktur Organisasi" />

            <div ref={sectionRef} className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                {/* ── Header ──────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200 sm:text-4xl">
                        Struktur Organisasi
                    </h1>
                    <p className="mt-1 text-lg font-semibold text-orange-400">PARI Pengda Jambi</p>
                    <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        Susunan kepengurusan Persatuan Radiografer Indonesia Pengurus Daerah Jambi.
                    </p>
                </motion.div>

                {/* ── Pembina & Penasihat (Fan Layout) ──────────── */}
                <AnimatedTeamSection title="Pembina & Penasihat" description="" members={advisors} />

                {/* ── Connector ──────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <ConnectorLine />
                </motion.div>

                {/* ── Ketua Umum ─────────────────────────────────── */}
                {chairman && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <ChairmanCard chairman={chairman} />
                    </motion.div>
                )}

                {/* ── Connector ──────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <HorizontalConnector />
                </motion.div>

                {/* ── Bidang-Bidang ──────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <div className="mb-4 text-center">
                        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                            Bidang-Bidang
                        </h2>
                    </div>
                    <DepartmentSection departments={preparedDepartments} />
                </motion.div>

                {/* ── Contact Person ─────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-8"
                >
                    <ContactSection contacts={contacts} />
                </motion.div>

                {/* ── Footer Note ────────────────────────────────── */}
                <div className="mt-6 text-center">
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                        Data struktur organisasi PARI Pengda Provinsi Jambi.
                    </p>
                </div>
            </div>
        </>
    );
}