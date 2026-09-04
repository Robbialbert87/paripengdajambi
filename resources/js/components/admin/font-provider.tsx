import { createContext, useContext, useState } from 'react';

import { fonts } from '@/config/fonts';
import type { Font } from '@/config/fonts';
import { getCookie, removeCookie, setCookie } from '@/lib/cookies';

const FONT_COOKIE_NAME = 'font';
const FONT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

type FontContextType = {
    font: Font;
    setFont: (font: Font) => void;
    resetFont: () => void;
};

const FontContext = createContext<FontContextType | null>(null);

export function FontProvider({ children }: { children: React.ReactNode }) {
    const [font, _setFont] = useState<Font>(() => {
        const saved = getCookie(FONT_COOKIE_NAME);

        return fonts.includes(saved as Font) ? (saved as Font) : fonts[0];
    });

    const setFont = (next: Font) => {
        _setFont(next);
        setCookie(FONT_COOKIE_NAME, next, FONT_COOKIE_MAX_AGE);
    };

    const resetFont = () => {
        _setFont(fonts[0]);
        removeCookie(FONT_COOKIE_NAME);
    };

    return (
        <FontContext value={{ font, setFont, resetFont }}>
            {children}
        </FontContext>
    );
}

export const useFont = () => {
    const context = useContext(FontContext);

    if (!context) {
        throw new Error('useFont must be used within a FontProvider');
    }

    return context;
};
