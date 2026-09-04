import { createContext, useContext } from 'react';

import { useAppearance } from '@/hooks/use-appearance';
import type { ResolvedAppearance } from '@/hooks/use-appearance';

type Theme = 'light' | 'dark';

type ThemeProviderState = {
    theme: Theme;
    resolvedTheme: ResolvedAppearance;
    setTheme: (theme: Theme) => void;
    resetTheme: () => void;
};

const initialState: ThemeProviderState = {
    theme: 'light',
    resolvedTheme: 'light',
    setTheme: () => null,
    resetTheme: () => null,
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { appearance, resolvedAppearance, updateAppearance } =
        useAppearance();

    const theme: Theme = appearance === 'dark' ? 'dark' : 'light';

    const contextValue: ThemeProviderState = {
        theme,
        resolvedTheme: resolvedAppearance,
        setTheme: (mode) => updateAppearance(mode),
        resetTheme: () => updateAppearance('light'),
    };

    return <ThemeContext value={contextValue}>{children}</ThemeContext>;
}

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};
