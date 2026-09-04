import { createContext, useContext, useEffect, useState } from 'react';

import { CommandMenu } from '@/components/admin/command-menu';

type SearchContextType = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        document.addEventListener('keydown', down);

        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <SearchContext value={{ open, setOpen }}>
            {children}
            <CommandMenu />
        </SearchContext>
    );
}

export const useSearch = () => {
    const context = useContext(SearchContext);

    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }

    return context;
};
