import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import {
    Check,
    Moon,
    PanelLeft,
    PanelLeftClose,
    RotateCcw,
    Settings,
    Sun,
} from 'lucide-react';

import { useFont } from '@/components/admin/font-provider';
import { useLayout } from '@/components/admin/layout-provider';
import { useTheme } from '@/components/admin/theme-provider';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const THEME_OPTIONS = [
    { value: 'light', label: 'Terang', icon: Sun },
    { value: 'dark', label: 'Gelap', icon: Moon },
] as const;

const SIDEBAR_OPTIONS = [
    { value: 'inset', label: 'Inset', icon: PanelLeft },
    { value: 'sidebar', label: 'Sidebar', icon: PanelLeft },
    { value: 'floating', label: 'Floating', icon: PanelLeft },
] as const;

const LAYOUT_OPTIONS = [
    { value: 'default', label: 'Default', icon: PanelLeft },
    { value: 'icon', label: 'Compact', icon: PanelLeftClose },
    { value: 'offcanvas', label: 'Offcanvas', icon: PanelLeft },
] as const;

const FONT_OPTIONS = [
    { value: 'inter', label: 'Inter', icon: Sun },
    { value: 'manrope', label: 'Manrope', icon: Moon },
    { value: 'system', label: 'System', icon: PanelLeft },
] as const;

export function ConfigDrawer() {
    const { resetTheme } = useTheme();
    const { resetLayout } = useLayout();
    const { setOpen } = useSidebar();

    const handleReset = () => {
        setOpen(true);
        resetTheme();
        resetLayout();
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Buka pengaturan tema"
                    className="rounded-full"
                >
                    <Settings aria-hidden="true" />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="pb-0 text-start">
                    <SheetTitle>Pengaturan Tema</SheetTitle>
                    <SheetDescription>
                        Sesuaikan tampilan dan tata letak sesuai preferensi
                        Anda.
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 overflow-y-auto px-4">
                    <ThemeConfig />
                    <FontConfig />
                    <SidebarConfig />
                    <LayoutConfig />
                </div>
                <SheetFooter className="gap-2">
                    <Button
                        variant="destructive"
                        onClick={handleReset}
                        aria-label="Reset semua pengaturan ke nilai awal"
                    >
                        Reset
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

function SectionTitle({
    title,
    showReset = false,
    onReset,
    resetAriaLabel,
}: {
    title: string;
    showReset?: boolean;
    onReset?: () => void;
    resetAriaLabel?: string;
}) {
    return (
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            {title}
            {showReset && onReset && (
                <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="size-4 rounded-full"
                    onClick={onReset}
                    aria-label={resetAriaLabel}
                >
                    <RotateCcw className="size-3" />
                </Button>
            )}
        </div>
    );
}

function OptionItem({
    value,
    label,
    icon: Icon,
}: {
    value: string;
    label: string;
    icon: React.ElementType;
}) {
    return (
        <RadioGroupPrimitive.Item
            value={value}
            className="group outline-none"
            aria-label={`Pilih ${label}`}
        >
            <div
                className={cn(
                    'relative rounded-[6px] ring-[1px] ring-border',
                    'group-data-[state=checked]:shadow-2xl group-data-[state=checked]:ring-primary',
                    'group-focus-visible:ring-2',
                )}
                role="img"
                aria-hidden="false"
            >
                <Check
                    className={cn(
                        'size-6 fill-primary stroke-white',
                        'absolute top-0 right-0 z-10 translate-x-1/2 -translate-y-1/2',
                        'group-data-[state=unchecked]:hidden',
                    )}
                />
                <div className="flex h-16 w-full items-center justify-center text-muted-foreground group-data-[state=checked]:text-primary">
                    <Icon className="size-8" />
                </div>
            </div>
            <div className="mt-1 text-xs">{label}</div>
        </RadioGroupPrimitive.Item>
    );
}

function ThemeConfig() {
    const { theme, setTheme } = useTheme();

    return (
        <div>
            <SectionTitle title="Tema" />
            <RadioGroupPrimitive.Root
                value={theme}
                onValueChange={(v) => setTheme(v as 'light' | 'dark')}
                className="grid w-full max-w-md grid-cols-3 gap-4"
                aria-label="Pilih preferensi tema"
            >
                {THEME_OPTIONS.map((item) => (
                    <OptionItem key={item.value} {...item} />
                ))}
            </RadioGroupPrimitive.Root>
        </div>
    );
}

function FontConfig() {
    const { font, setFont } = useFont();

    return (
        <div>
            <SectionTitle title="Font" />
            <RadioGroupPrimitive.Root
                value={font}
                onValueChange={(v) =>
                    setFont(v as 'inter' | 'manrope' | 'system')
                }
                className="grid w-full max-w-md grid-cols-3 gap-4"
                aria-label="Pilih font"
            >
                {FONT_OPTIONS.map((item) => (
                    <OptionItem key={item.value} {...item} />
                ))}
            </RadioGroupPrimitive.Root>
        </div>
    );
}

function SidebarConfig() {
    const { defaultVariant, variant, setVariant } = useLayout();

    return (
        <div className="max-md:hidden">
            <SectionTitle
                title="Sidebar"
                showReset={defaultVariant !== variant}
                onReset={() => setVariant(defaultVariant)}
                resetAriaLabel="Reset gaya sidebar ke awal"
            />
            <RadioGroupPrimitive.Root
                value={variant}
                onValueChange={(v) =>
                    setVariant(v as 'inset' | 'sidebar' | 'floating')
                }
                className="grid w-full max-w-md grid-cols-3 gap-4"
                aria-label="Pilih gaya sidebar"
            >
                {SIDEBAR_OPTIONS.map((item) => (
                    <OptionItem key={item.value} {...item} />
                ))}
            </RadioGroupPrimitive.Root>
        </div>
    );
}

function LayoutConfig() {
    const { open, setOpen } = useSidebar();
    const { defaultCollapsible, collapsible, setCollapsible } = useLayout();

    const radioState = open ? 'default' : collapsible;

    return (
        <div className="max-md:hidden">
            <SectionTitle
                title="Tata Letak"
                showReset={radioState !== 'default'}
                onReset={() => {
                    setOpen(true);
                    setCollapsible(defaultCollapsible);
                }}
                resetAriaLabel="Reset opsi tata letak ke awal"
            />
            <RadioGroupPrimitive.Root
                value={radioState}
                onValueChange={(v) => {
                    if (v === 'default') {
                        setOpen(true);

                        return;
                    }

                    setOpen(false);
                    setCollapsible(v as 'icon' | 'offcanvas');
                }}
                className="grid w-full max-w-md grid-cols-3 gap-4"
                aria-label="Pilih tata letak"
            >
                {LAYOUT_OPTIONS.map((item) => (
                    <OptionItem key={item.value} {...item} />
                ))}
            </RadioGroupPrimitive.Root>
        </div>
    );
}
