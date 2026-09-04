import { router } from '@inertiajs/react';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import React from 'react';

import { useSearch } from '@/components/admin/search-provider';
import { useTheme } from '@/components/admin/theme-provider';
import { useAdminNav } from '@/components/admin/use-admin-nav';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toUrl } from '@/lib/utils';

export function CommandMenu() {
    const { groups } = useAdminNav();
    const { setTheme } = useTheme();
    const { open, setOpen } = useSearch();

    const runCommand = React.useCallback(
        (command: () => void) => {
            setOpen(false);
            command();
        },
        [setOpen],
    );

    const navigateTo = (href: string) => runCommand(() => router.visit(href));

    return (
        <CommandDialog modal open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Ketik perintah atau cari..." />
            <CommandList>
                <ScrollArea type="hover" className="h-72 pe-1">
                    <CommandEmpty>Tidak ada hasil.</CommandEmpty>
                    {groups.map((group) => (
                        <CommandGroup key={group.title} heading={group.title}>
                            {group.items.map((navItem, i) => {
                                if (navItem.href) {
                                    return (
                                        <CommandItem
                                            key={`${toUrl(navItem.href)}-${i}`}
                                            value={navItem.title}
                                            onSelect={() =>
                                                navigateTo(toUrl(navItem.href))
                                            }
                                        >
                                            <div className="flex size-4 items-center justify-center">
                                                <ArrowRight className="size-2 text-muted-foreground/80" />
                                            </div>
                                            {navItem.title}
                                        </CommandItem>
                                    );
                                }

                                return null;
                            })}
                        </CommandGroup>
                    ))}
                    <CommandSeparator />
                    <CommandGroup heading="Tema">
                        <CommandItem
                            onSelect={() => runCommand(() => setTheme('light'))}
                        >
                            <Sun /> <span>Terang</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => setTheme('dark'))}
                        >
                            <Moon className="scale-90" />
                            <span>Gelap</span>
                        </CommandItem>
                    </CommandGroup>
                </ScrollArea>
            </CommandList>
        </CommandDialog>
    );
}
