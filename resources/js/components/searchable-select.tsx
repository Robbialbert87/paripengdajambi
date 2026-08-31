import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface SearchableSelectOption {
    value: string | number;
    label: string;
}

interface SearchableSelectProps {
    options: SearchableSelectOption[];
    value: string | number | null;
    onValueChange: (value: string | number | null) => void;
    name: string;
    placeholder?: string;
    emptyText?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    icon?: ReactNode;
}

export default function SearchableSelect({
    options,
    value,
    onValueChange,
    name,
    placeholder = 'Ketik untuk mencari...',
    emptyText = 'Tidak ditemukan',
    disabled = false,
    required = false,
    className,
    icon,
}: SearchableSelectProps) {
    const [query, setQuery] = useState('');
    const [prevValue, setPrevValue] = useState(value);
    const [open, setOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const rootRef = useRef<HTMLDivElement>(null);

    const selectedLabel = useMemo(() => {
        const selected = options.find((option) => option.value === value);

        return selected ? selected.label : '';
    }, [options, value]);

    if (prevValue !== value) {
        setPrevValue(value);
        setQuery(selectedLabel);
    }

    const filteredOptions = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (!q) {
            return options;
        }

        return options.filter((option) =>
            option.label.toLowerCase().includes(q),
        );
    }, [options, query]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleOutsideClick = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () =>
            document.removeEventListener('mousedown', handleOutsideClick);
    }, [open]);

    const selectOption = (option: SearchableSelectOption) => {
        onValueChange(option.value);
        setQuery(option.label);
        setOpen(false);
    };

    const handleInputChange = (text: string) => {
        setQuery(text);
        setHighlightedIndex(0);

        if (text !== selectedLabel) {
            onValueChange(null);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) {
            return;
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();

                if (!open) {
                    setOpen(true);
                    setHighlightedIndex(0);
                } else if (filteredOptions.length > 0) {
                    setHighlightedIndex((index) =>
                        Math.min(index + 1, filteredOptions.length - 1),
                    );
                }

                break;

            case 'ArrowUp':
                event.preventDefault();
                setHighlightedIndex((index) => Math.max(index - 1, 0));
                break;

            case 'Enter':
                if (open && filteredOptions[highlightedIndex]) {
                    event.preventDefault();
                    selectOption(filteredOptions[highlightedIndex]);
                }

                break;

            case 'Escape':
                setOpen(false);
                break;

            default:
                break;
        }
    };

    return (
        <div ref={rootRef} className="relative">
            <input type="hidden" name={name} value={value ?? ''} />

            <input
                type="text"
                id={name}
                disabled={disabled}
                required={required}
                autoComplete="off"
                placeholder={placeholder}
                value={query}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                onChange={(event) => handleInputChange(event.target.value)}
                onKeyDown={handleKeyDown}
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                className={cn(
                    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200',
                    className,
                )}
            />

            {icon && (
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                    {icon}
                </span>
            )}

            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-neutral-400" />

            {open && !disabled && (
                <ul
                    role="listbox"
                    className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
                >
                    {filteredOptions.length === 0 ? (
                        <li className="px-4 py-2.5 text-sm text-neutral-500">
                            {emptyText}
                        </li>
                    ) : (
                        filteredOptions.map((option, index) => (
                            <li
                                key={option.value}
                                role="option"
                                aria-selected={option.value === value}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => selectOption(option)}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 outline-none hover:bg-orange-50 dark:text-neutral-200 dark:hover:bg-neutral-700/60',
                                    index === highlightedIndex &&
                                        'bg-orange-50 dark:bg-neutral-700/60',
                                )}
                            >
                                <span className="truncate">{option.label}</span>

                                {option.value === value && (
                                    <CheckIcon className="ml-auto size-4 shrink-0 text-orange-400" />
                                )}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}
