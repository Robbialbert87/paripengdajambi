import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    ClipboardList,
    Scale,
    GraduationCap,
    Monitor,
    Wallet,
    BookOpen,
    Users,
    Mail,
    Phone,
    Instagram,
    type LucideIcon,
} from 'lucide-react';

/* ─── Types ────────────────────────────────────────────────────────────────── */

interface Person {
    name: string;
    initials: string;
}

interface Department {
    name: string;
    icon: LucideIcon;
    chairman?: Person;
    members: Person[];
}

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const advisors: Person[] = [
    { name: 'Haryono, S.Si', initials: 'HY' },
    { name: 'M. Untung Sukemi S, SKM, SST', initials: 'MU' },
    { name: 'Pahmi, BSc', initials: 'PM' },
    { name: 'Nurdin, AMR', initials: 'ND' },
    { name: 'Mochamad Imron, S.Si, M.Tr. ID', initials: 'MI' },
    { name: 'Nurhasan, Str. Kes (Rad)', initials: 'NH' },
    { name: 'Landrayani, AMR', initials: 'LR' },
];

const chairman: Person = {
    name: 'Alen Rizaldi, AMR., S.KM',
    initials: 'AR',
};

const departments: Department[] = [
    {
        name: 'Bid. Sekretariat',
        icon: ClipboardList,
        chairman: { name: 'Wali Ikhwan, A.Md. Rad', initials: 'WI' },
        members: [
            { name: 'Resti Muharrami, A.Md. Rad', initials: 'RM' },
            { name: 'Sandini, Amd. Rad', initials: 'SN' },
            { name: 'Marlengga, AMR', initials: 'ML' },
        ],
    },
    {
        name: 'Bid. Advokasi Hukum dan Organisasi',
        icon: Scale,
        chairman: { name: 'Barenton, Am.Rad', initials: 'BR' },
        members: [
            { name: 'Amri Ramadhani, Am.Rad', initials: 'AR' },
            { name: 'Endi Ikhwanda, Am.Rad', initials: 'EI' },
            { name: 'Rina Faridah, Amd. Rad', initials: 'RF' },
        ],
    },
    {
        name: 'Bid. Kaderisasi dan Pengembangan Profesi',
        icon: GraduationCap,
        chairman: { name: 'Aris Yeni Susanti, Amd. Rad', initials: 'AS' },
        members: [
            { name: 'Ekapurna Widyastuti A.A, AMR', initials: 'EW' },
            { name: 'Fernandes, S.Tr.Rad', initials: 'FN' },
            { name: 'Fathul Abrar Ilyas, S.Tr.Kes', initials: 'FA' },
        ],
    },
    {
        name: 'Bid. IT dan Humas',
        icon: Monitor,
        chairman: { name: 'Muhammad Iqbal, AM.Rad', initials: 'MI' },
        members: [
            { name: 'Erika Ayu Ningsih, Amd.Rad', initials: 'EN' },
            { name: 'Azizah Aswar, A.Md.Kes(Rad)', initials: 'AA' },
            { name: 'Fauzan Pratama, Amd.Rad', initials: 'FP' },
        ],
    },
    {
        name: 'Bid. Bendahara',
        icon: Wallet,
        members: [
            { name: 'Christine WA, AMR', initials: 'CW' },
            { name: 'Yuniarti, AMR', initials: 'YN' },
            { name: 'Tesa Meilani, AMR', initials: 'TM' },
        ],
    },
    {
        name: 'Bid. Diklat dan Pelatihan',
        icon: BookOpen,
        chairman: { name: 'Diah Wulansari, Amd.Rad', initials: 'DW' },
        members: [
            { name: 'Hamidah, A.md Rad', initials: 'HM' },
            { name: 'Swangga Bagus Winarta, Am.Rad', initials: 'SW' },
            { name: 'Angga Agustiar, A.Md.Rad, SKM', initials: 'AA' },
        ],
    },
    {
        name: 'Bid. Kesra dan Pengabdian Masyarakat',
        icon: Users,
        chairman: { name: 'M. Edo Kurniawan, S.SiT', initials: 'ME' },
        members: [
            { name: 'M. Dodo Hernando, AMR', initials: 'DH' },
            { name: 'Elga Emertha, AM.Rad', initials: 'EE' },
            { name: 'Cindy Khairidea Sari, A.Md.Kes Rad', initials: 'CK' },
        ],
    },
];

const contactPerson = [
    { name: 'Ikhwan', phone: '08537443 8754' },
    { name: 'Sandini', phone: '08123485 0713' },
    { name: 'Resti', phone: '08570964 5434' },
    { name: 'Marlengga', phone: '08526611 8568' },
];

/* ─── Hooks ────────────────────────────────────────────────────────────────── */

function useInView(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, visible };
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
            className={`flex ${sizeClasses[size]} shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-500 font-bold text-white shadow-md dark:from-orange-500 dark:to-orange-600`}
        >
            {person.initials}
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

function AdvisorCard({ person, index }: { person: Person; index: number }) {
    return (
        <div
            className="group flex flex-col items-center gap-2 rounded-xl border border-yellow-100/40 bg-yellow-50/60 px-3 py-4 text-center backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-700/40 dark:bg-neutral-800/80"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <Avatar person={person} size="md" />
            <p className="text-xs font-semibold leading-tight text-neutral-700 dark:text-neutral-300">
                {person.name}
            </p>
        </div>
    );
}

function ChairmanCard() {
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

function MemberRow({ person, index }: { person: Person; index: number }) {
    return (
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-yellow-50/80 dark:hover:bg-neutral-700/30">
            <Avatar person={person} size="sm" />
            <p className="min-w-0 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                {person.name}
            </p>
        </div>
    );
}

function DepartmentCard({ dept, index }: { dept: Department; index: number }) {
    const Icon = dept.icon;
    return (
        <div
            className="group flex flex-col rounded-xl border border-yellow-100/40 bg-yellow-50/60 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-700/40 dark:bg-neutral-800/80"
            style={{ animationDelay: `${index * 80}ms` }}
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
            <div className="flex-1 p-4">
                {/* Ketua */}
                {dept.chairman && (
                    <div className="mb-3">
                        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-400">
                            Ketua
                        </p>
                        <div className="flex items-center gap-2.5 rounded-lg bg-orange-50/60 px-3 py-2 dark:bg-orange-900/10">
                            <Avatar person={dept.chairman} size="sm" />
                            <p className="min-w-0 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                                {dept.chairman.name}
                            </p>
                        </div>
                    </div>
                )}

                {/* Divider */}
                {dept.chairman && (
                    <div className="my-2 border-t border-dashed border-neutral-200 dark:border-neutral-700" />
                )}

                {/* Anggota */}
                <div>
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                        Anggota
                    </p>
                    <div className="space-y-0.5">
                        {dept.members.map((member, i) => (
                            <MemberRow key={member.name} person={member} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactSection() {
    return (
        <div className="rounded-2xl border border-yellow-100/40 bg-yellow-50/60 p-6 backdrop-blur-md dark:border-neutral-700/40 dark:bg-neutral-800/80">
            <h3 className="mb-4 text-lg font-bold text-neutral-800 dark:text-neutral-200">
                Contact Person
            </h3>

            {/* CP List */}
            <div className="mb-4 grid gap-2 sm:grid-cols-2">
                {contactPerson.map((cp) => (
                    <div
                        key={cp.name}
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

export default function StrukturOrganisasi() {
    const { ref: sectionRef, visible } = useInView(0.05);

    return (
        <>
            <Head title="Struktur Organisasi" />

            <div ref={sectionRef} className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                {/* ── Header ──────────────────────────────────────── */}
                <div
                    className={`mb-8 text-center transition-all duration-700 ${
                        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                    }`}
                >
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200 sm:text-4xl">
                        Struktur Organisasi
                    </h1>
                    <p className="mt-1 text-lg font-semibold text-orange-400">PARI Pengda Jambi</p>
                    <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        Susunan kepengurusan Persatuan Radiografer Indonesia Pengurus Daerah Jambi.
                    </p>
                </div>

                {/* ── Pembina & Penasihat ────────────────────────── */}
                <div
                    className={`transition-all duration-700 delay-100 ${
                        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                    }`}
                >
                    <div className="mb-4 text-center">
                        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                            Pembina & Penasihat
                        </h2>
                    </div>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
                        {advisors.map((advisor, i) => (
                            <AdvisorCard key={advisor.name} person={advisor} index={i} />
                        ))}
                    </div>
                </div>

                {/* ── Connector ──────────────────────────────────── */}
                <div
                    className={`transition-all duration-700 delay-200 ${
                        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                    }`}
                >
                    <ConnectorLine />
                </div>

                {/* ── Ketua Umum ─────────────────────────────────── */}
                <div
                    className={`transition-all duration-700 delay-300 ${
                        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                    }`}
                >
                    <ChairmanCard />
                </div>

                {/* ── Connector ──────────────────────────────────── */}
                <div
                    className={`transition-all duration-700 delay-300 ${
                        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                    }`}
                >
                    <HorizontalConnector />
                </div>

                {/* ── Bidang-Bidang ──────────────────────────────── */}
                <div
                    className={`transition-all duration-700 delay-400 ${
                        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                    }`}
                >
                    <div className="mb-4 text-center">
                        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                            Bidang-Bidang
                        </h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {departments.map((dept, i) => (
                            <DepartmentCard key={dept.name} dept={dept} index={i} />
                        ))}
                    </div>
                </div>

                {/* ── Contact Person ─────────────────────────────── */}
                <div
                    className={`mt-8 transition-all duration-700 delay-500 ${
                        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                    }`}
                >
                    <ContactSection />
                </div>

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
