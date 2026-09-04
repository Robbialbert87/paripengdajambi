import { createContext, useContext, useState } from 'react';

import { getCookie, setCookie } from '@/lib/cookies';

export type Collapsible = 'offcanvas' | 'icon' | 'none';
type Variant = 'inset' | 'sidebar' | 'floating';

const LAYOUT_COLLAPSIBLE_COOKIE_NAME = 'layout_collapsible';
const LAYOUT_VARIANT_COOKIE_NAME = 'layout_variant';
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const DEFAULT_VARIANT: Variant = 'inset';
const DEFAULT_COLLAPSIBLE: Collapsible = 'icon';

type LayoutContextType = {
    resetLayout: () => void;

    defaultCollapsible: Collapsible;
    collapsible: Collapsible;
    setCollapsible: (collapsible: Collapsible) => void;

    defaultVariant: Variant;
    variant: Variant;
    setVariant: (variant: Variant) => void;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const [collapsible, _setCollapsible] = useState<Collapsible>(() => {
        const saved = getCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME);

        return (saved as Collapsible) || DEFAULT_COLLAPSIBLE;
    });

    const [variant, _setVariant] = useState<Variant>(() => {
        const saved = getCookie(LAYOUT_VARIANT_COOKIE_NAME);

        return (saved as Variant) || DEFAULT_VARIANT;
    });

    const setCollapsible = (next: Collapsible) => {
        _setCollapsible(next);
        setCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME, next, LAYOUT_COOKIE_MAX_AGE);
    };

    const setVariant = (next: Variant) => {
        _setVariant(next);
        setCookie(LAYOUT_VARIANT_COOKIE_NAME, next, LAYOUT_COOKIE_MAX_AGE);
    };

    const resetLayout = () => {
        setCollapsible(DEFAULT_COLLAPSIBLE);
        setVariant(DEFAULT_VARIANT);
    };

    const contextValue: LayoutContextType = {
        resetLayout,
        defaultCollapsible: DEFAULT_COLLAPSIBLE,
        collapsible,
        setCollapsible,
        defaultVariant: DEFAULT_VARIANT,
        variant,
        setVariant,
    };

    return <LayoutContext value={contextValue}>{children}</LayoutContext>;
}

export const useLayout = () => {
    const context = useContext(LayoutContext);

    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }

    return context;
};
