import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <AppLogoIcon className="h-7 w-auto mix-blend-multiply dark:mix-blend-screen" />
            </div>
            <div className="ml-1 grid flex-1 text-left">
                <span className="mb-0.5 truncate text-[15px] leading-tight font-bold text-[#313b5e] dark:text-white">
                    PARI Pengda Jambi
                </span>
                <span className="truncate text-[11px] leading-tight text-neutral-500 dark:text-neutral-400">
                    Pengurus Daerah Jambi
                </span>
            </div>
        </>
    );
}
