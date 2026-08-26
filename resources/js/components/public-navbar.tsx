import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import LoginModal from '@/components/login-modal';

interface DropdownItem {
    label: string;
    href: string;
}

interface NavMenuItem {
    label: string;
    href?: string;
    dropdown?: DropdownItem[];
}

const navItems: NavMenuItem[] = [
    { label: 'Beranda', href: '/' },
    {
        label: 'Profil',
        dropdown: [
            { label: 'Tentang PARI', href: '/profil/tentang' },
            { label: 'Visi & Misi', href: '/profil/visi-misi' },
            { label: 'Sejarah', href: '/profil/sejarah' },
            { label: 'Struktur Organisasi', href: '/profil/struktur-organisasi' },
            { label: 'Pengurus', href: '/profil/pengurus' },
            { label: 'Program Kerja', href: '/profil/program-kerja' },
        ],
    },
    {
        label: 'Keanggotaan',
        dropdown: [
            { label: 'Registrasi Anggota', href: '/keanggotaan/registrasi' },
            { label: 'Direktori Anggota', href: '/keanggotaan/direktori' },
            { label: 'Update Data', href: '/keanggotaan/update-data' },
            { label: 'Status Keanggotaan', href: '/keanggotaan/status' },
        ],
    },
    {
        label: 'Layanan',
        dropdown: [
            { label: 'Iuran Anggota', href: '/layanan/iuran' },
            { label: 'Pengajuan Surat', href: '/layanan/pengajuan-surat' },
            { label: 'Tracking Pengajuan', href: '/layanan/tracking' },
            { label: 'Download Dokumen', href: '/layanan/download' },
        ],
    },
    {
        label: 'Kegiatan',
        dropdown: [
            { label: 'Event & Seminar', href: '/kegiatan/event' },
            { label: 'Agenda', href: '/kegiatan/agenda' },
            { label: 'Galeri', href: '/kegiatan/galeri' },
        ],
    },
    {
        label: 'Informasi',
        dropdown: [
            { label: 'Berita', href: '/informasi/berita' },
            { label: 'Pengumuman', href: '/informasi/pengumuman' },
            { label: 'Edukasi', href: '/informasi/edukasi' },
        ],
    },
    { label: 'Kontak', href: '/kontak' },
];

function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= 768 : true
    );
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)');
        const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsDesktop(e.matches);
        mq.addEventListener('change', handler);
        handler(mq);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return isDesktop;
}

function useIsDark() {
    const [isDark, setIsDark] = useState(() =>
        typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
    );
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);
    return isDark;
}

function DropdownMenu({
    item,
    isOpen,
    currentUrl,
    onToggle,
    onClose,
    onOpen,
}: {
    item: NavMenuItem;
    isOpen: boolean;
    currentUrl: string;
    onToggle: () => void;
    onClose: () => void;
    onOpen: () => void;
}) {
    const isActive = item.dropdown?.some((sub) => currentUrl === sub.href) ?? false;
    const ref = useRef<HTMLDivElement>(null);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isDesktop = useIsDesktop();

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleMouseEnter = useCallback(() => {
        if (!isDesktop) return;
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        onOpen();
    }, [isDesktop, onOpen]);

    const handleMouseLeave = useCallback(() => {
        if (!isDesktop) return;
        hoverTimeout.current = setTimeout(() => onClose(), 100);
    }, [isDesktop, onClose]);

    return (
        <div
            ref={ref}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                onClick={onToggle}
                className={`flex items-center gap-1 rounded-lg text-base font-medium ring-zinc-500 outline-hidden hover:text-neutral-500 focus-visible:ring-3 md:py-3 md:text-sm 2xl:text-base dark:ring-zinc-200 dark:hover:text-neutral-500 dark:focus:outline-hidden ${
                    isActive
                        ? 'text-orange-400 dark:text-orange-300'
                        : 'text-neutral-600 dark:text-neutral-400'
                }`}
            >
                {item.label}
                <svg
                    className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && item.dropdown && (
                <div className="absolute top-full left-0 z-50 mt-2 w-56 rounded-xl border border-yellow-100/40 bg-yellow-50 p-2 shadow-lg dark:border-neutral-700/40 dark:bg-neutral-800">
                    {item.dropdown.map((subItem) => (
                        <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={onClose}
                            className={`block rounded-lg px-3 py-2 text-sm ring-zinc-500 outline-hidden transition duration-300 focus-visible:ring-3 dark:ring-zinc-200 ${
                                currentUrl === subItem.href
                                    ? 'bg-yellow-100 text-orange-400 dark:bg-neutral-700 dark:text-orange-300'
                                    : 'text-neutral-600 hover:bg-yellow-100 hover:text-orange-400 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-orange-300'
                            }`}
                        >
                            {subItem.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

function ThemeToggle({ className }: { className?: string }) {
    const isDark = useIsDark();

    const toggle = useCallback(() => {
        const html = document.documentElement;
        html.classList.toggle('dark');
        localStorage.setItem('hs_theme', html.classList.contains('dark') ? 'dark' : 'default');
    }, []);

    return (
        <button
            type="button"
            onClick={toggle}
            className={className}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="4" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                </svg>
            ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
}

export default function PublicNavbar() {
    const { auth } = usePage().props as { auth?: { user?: { name: string } } };
    const [mobileOpen, setMobileOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const currentUrl = usePage().url;
    const isDark = useIsDark();
    const [openDropdown, setOpenDropdown] = useState<string | null>(() => {
        const active = navItems.find(
            (item) => item.dropdown?.some((sub) => sub.href === currentUrl)
        );
        return active?.label ?? null;
    });

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    useEffect(() => {
        setMobileOpen(false);
    }, [currentUrl]);

    return (
        <header className="sticky inset-x-0 top-4 z-50 flex w-full flex-wrap text-sm md:flex-nowrap md:justify-start">
            <nav
                className="relative mx-2 w-full rounded-[36px] border border-yellow-100/40 bg-yellow-50/60 px-4 py-3 backdrop-blur-md md:flex md:items-center md:justify-between md:px-6 md:py-0 lg:px-8 xl:mx-auto dark:border-neutral-700/40 dark:bg-neutral-800/80 dark:backdrop-blur-md"
                aria-label="Global"
            >
                <div className="flex items-center justify-between">
                    <Link
                        className="flex-none rounded-lg ring-zinc-500 outline-hidden focus-visible:ring-3 dark:ring-zinc-200 dark:focus:outline-hidden"
                        href="/"
                        aria-label="Brand"
                    >
                        <div className="flex items-center gap-2">
                            <img src="/logo (2).webp" alt="Logo PARI" className="h-13 w-auto mix-blend-multiply dark:mix-blend-screen" />
                            <div className="leading-tight">
                                <span className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">Persatuan Radiografer Indonesia</span>
                                <span className="block text-xs font-bold text-neutral-600 dark:text-neutral-400">Pengurus Daerah Provinsi Jambi</span>
                            </div>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-neutral-600 transition duration-300 hover:bg-neutral-200 disabled:pointer-events-none disabled:opacity-50 md:hidden dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:outline-hidden"
                        aria-label="Toggle navigation"
                    >
                        {mobileOpen ? (
                            <svg className="h-5 w-5 shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" x2="21" y1="6" y2="6"></line>
                                <line x1="3" x2="21" y1="12" y2="12"></line>
                                <line x1="3" x2="21" y1="18" y2="18"></line>
                            </svg>
                        )}
                    </button>
                </div>

                {/* Desktop menu */}
                <div className="hidden grow basis-full md:block">
                    <div className="mt-5 flex flex-col gap-x-0 gap-y-4 md:mt-0 md:flex-row md:items-center md:justify-end md:gap-x-4 md:gap-y-0 md:ps-7 lg:gap-x-7">
                        {navItems.map((item) =>
                            item.dropdown ? (
                                <DropdownMenu
                                    key={item.label}
                                    item={item}
                                    isOpen={openDropdown === item.label}
                                    currentUrl={currentUrl}
                                    onToggle={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                                    onOpen={() => setOpenDropdown(item.label)}
                                    onClose={() => setOpenDropdown(null)}
                                />
                            ) : (
                                <Link
                                    key={item.href}
                                    href={item.href!}
                                    className={`rounded-lg text-base font-medium ring-zinc-500 outline-hidden hover:text-neutral-500 focus-visible:ring-3 md:py-3 md:text-sm 2xl:text-base dark:ring-zinc-200 dark:hover:text-neutral-500 dark:focus:outline-hidden ${
                                        currentUrl === item.href
                                            ? 'text-orange-400 dark:text-orange-300'
                                            : 'text-neutral-600 dark:text-neutral-400'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            )
                        )}

                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-orange-400 px-4 py-2.5 text-sm font-bold text-neutral-50 ring-zinc-500 transition duration-300 hover:bg-orange-500 focus-visible:ring-3 outline-hidden dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:outline-hidden"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setLoginOpen(true)}
                                className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-orange-400 px-4 py-2.5 text-sm font-bold text-neutral-50 ring-zinc-500 transition duration-300 hover:bg-orange-500 focus-visible:ring-3 outline-hidden dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:outline-hidden"
                            >
                                Login
                            </button>
                        )}

                        <ThemeToggle className="hidden text-neutral-600 md:inline-block dark:text-neutral-400" />
                    </div>
                </div>

                {/* Mobile menu — absolute overlay */}
                {mobileOpen && (
                    <div className="absolute left-0 right-0 top-full z-50 mx-2 mt-2 max-h-[75vh] overflow-y-auto rounded-2xl border border-yellow-100/40 bg-yellow-50 p-4 shadow-lg md:hidden dark:border-neutral-700/40 dark:bg-neutral-800">
                        {navItems.map((item) =>
                            item.dropdown ? (
                                <div key={item.label} className="py-1">
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-yellow-100 dark:hover:bg-neutral-700 ${
                                            item.dropdown?.some((sub) => currentUrl === sub.href)
                                                ? 'text-orange-400 dark:text-orange-300'
                                                : 'text-neutral-600 dark:text-neutral-400'
                                        }`}
                                    >
                                        {item.label}
                                        <svg
                                            className={`h-4 w-4 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {openDropdown === item.label && (
                                        <div className="ml-4 mt-1 space-y-1">
                                            {item.dropdown.map((subItem) => (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`block rounded-lg px-3 py-2 text-sm hover:bg-yellow-100 hover:text-orange-400 dark:hover:bg-neutral-700 dark:hover:text-orange-300 ${
                                                        currentUrl === subItem.href
                                                            ? 'bg-yellow-100 text-orange-400 dark:bg-neutral-700 dark:text-orange-300'
                                                            : 'text-neutral-600 dark:text-neutral-400'
                                                    }`}
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={item.href}
                                    href={item.href!}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                                        currentUrl === item.href
                                            ? 'text-orange-400 dark:text-orange-300'
                                            : 'text-neutral-600 hover:bg-yellow-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            )
                        )}

                        <div className="mt-3 border-t border-yellow-100 pt-3 dark:border-neutral-700">
                            <button
                                type="button"
                                onClick={() => {
                                    const html = document.documentElement;
                                    html.classList.toggle('dark');
                                    localStorage.setItem('hs_theme', html.classList.contains('dark') ? 'dark' : 'default');
                                }}
                                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-yellow-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                            >
                                <span>{isDark ? 'Mode Terang' : 'Mode Gelap'}</span>
                                {isDark ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <circle cx="12" cy="12" r="4" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileOpen(false)}
                                    className="mt-1 block w-full rounded-lg bg-orange-400 px-4 py-2.5 text-center text-sm font-bold text-neutral-50 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => { setLoginOpen(true); setMobileOpen(false); }}
                                    className="mt-1 block w-full rounded-lg bg-orange-400 px-4 py-2.5 text-center text-sm font-bold text-neutral-50 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>
            <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
        </header>
    );
}
