import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Columns3,
    Inbox,
    Search,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    title: string;
    subtitle: string;
    toolbarActions?: ReactNode;
    searchPlaceholder?: string;
    emptyState?: string;
    initialPageSize?: number;
}

function columnLabel(id: string, header: unknown): string {
    return typeof header === 'string' ? header : id;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    title,
    subtitle,
    toolbarActions,
    searchPlaceholder = 'Cari...',
    emptyState = 'Tidak ada data.',
    initialPageSize = 10,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: initialPageSize,
            },
        },
        globalFilterFn: 'includesString',
    });

    const globalFilter = table.getState().globalFilter;
    const filteredCount = table.getFilteredRowModel().rows.length;
    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    const pageStart = pageSize * pageIndex + 1;
    const pageEnd = Math.min(pageSize * (pageIndex + 1), filteredCount);

    return (
        <div className="overflow-hidden rounded-2xl border border-neutral-300/60 bg-neutral-100 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
            <div className="flex flex-col gap-4 border-b border-neutral-300/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                <div>
                    <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                        {title}
                    </h2>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        {subtitle}
                    </p>
                </div>
                {toolbarActions}
            </div>

            <div className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                        value={globalFilter ?? ''}
                        onChange={(event) =>
                            table.setGlobalFilter(event.target.value)
                        }
                        placeholder={searchPlaceholder}
                        className="h-9 bg-white pr-9 pl-9 dark:bg-neutral-900/60"
                    />
                    {globalFilter ? (
                        <button
                            type="button"
                            onClick={() => table.setGlobalFilter('')}
                            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-0.5 text-neutral-400 transition hover:text-neutral-600 dark:hover:text-neutral-300"
                            aria-label="Hapus pencarian"
                        >
                            <X className="size-4" />
                        </button>
                    ) : null}
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-9 gap-2 bg-white dark:bg-neutral-900/60"
                            >
                                <Columns3 className="size-4" />
                                Kolom
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {table
                                .getAllLeafColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                        role="checkbox"
                                    >
                                        {columnLabel(
                                            column.id,
                                            column.columnDef.header,
                                        )}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {filteredCount} baris
                    </span>
                </div>
            </div>

            <div className="border-y border-neutral-300/60 bg-white/60 dark:border-white/10 dark:bg-neutral-900/40">
                {filteredCount === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                        <Inbox className="size-8 text-neutral-300 dark:text-neutral-600" />
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {emptyState}
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        const canSort =
                                            header.column.getCanSort();

                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder ? null : (
                                                    <button
                                                        type="button"
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        disabled={!canSort}
                                                        className={cn(
                                                            'group flex items-center gap-1.5 disabled:pointer-events-none',
                                                            canSort
                                                                ? 'cursor-pointer hover:text-neutral-800 dark:hover:text-neutral-200'
                                                                : 'cursor-default',
                                                        )}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                        {canSort ? (
                                                            header.column.getIsSorted() ===
                                                            'asc' ? (
                                                                <ArrowUp className="size-3.5 text-indigo-500" />
                                                            ) : header.column.getIsSorted() ===
                                                              'desc' ? (
                                                                <ArrowDown className="size-3.5 text-indigo-500" />
                                                            ) : (
                                                                <ArrowUpDown className="size-3.5 text-neutral-400 transition group-hover:text-neutral-600 dark:group-hover:text-neutral-300" />
                                                            )
                                                        ) : null}
                                                    </button>
                                                )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="bg-white/60 transition-colors hover:bg-neutral-200/70 dark:bg-neutral-900/40 dark:hover:bg-neutral-800/60"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <div className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Menampilkan {filteredCount === 0 ? 0 : pageStart}–{pageEnd}{' '}
                    dari {filteredCount} baris
                </p>

                <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                        Baris per halaman
                        <select
                            value={pageSize}
                            onChange={(event) =>
                                table.setPageSize(Number(event.target.value))
                            }
                            className="h-8 rounded-lg border border-neutral-200 bg-white px-2 text-xs text-neutral-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                        >
                            {[10, 25, 50, 100].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="ml-1 flex items-center gap-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 bg-white p-0 dark:bg-neutral-900/60"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            aria-label="Halaman sebelumnya"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <span className="min-w-14 px-1 text-center text-xs text-neutral-500 dark:text-neutral-400">
                            {pageIndex + 1} / {table.getPageCount() || 1}
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 bg-white p-0 dark:bg-neutral-900/60"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            aria-label="Halaman berikutnya"
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
