import { Head } from '@inertiajs/react';
import { Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

interface KabupatenKotaOption {
    id: number;
    name: string;
}

interface MemberItem {
    member_number: string | null;
    full_name: string;
    photo: string | null;
    kabupaten_kota_id: number | null;
    kabupaten_kota: string | null;
    instansi: string | null;
}

interface DirektoriProps {
    members: MemberItem[];
    kabupatenKota: KabupatenKotaOption[];
}

const inputClass =
    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200';

export default function Direktori({ members, kabupatenKota }: DirektoriProps) {
    const [search, setSearch] = useState('');
    const [kabupatenId, setKabupatenId] = useState<number | ''>('');

    const filteredMembers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return members.filter((member) => {
            const matchesSearch =
                query === '' ||
                member.full_name.toLowerCase().includes(query) ||
                (member.member_number ?? '').toLowerCase().includes(query) ||
                (member.instansi ?? '').toLowerCase().includes(query);
            const matchesWilayah =
                kabupatenId === '' || member.kabupaten_kota_id === kabupatenId;

            return matchesSearch && matchesWilayah;
        });
    }, [members, search, kabupatenId]);

    return (
        <>
            <Head title="Direktori Anggota" />

            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
                <div className="text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/60 px-4 py-1 text-xs font-bold text-orange-600 dark:border-orange-800/50 dark:bg-orange-900/20 dark:text-orange-400">
                        <Users className="size-3.5" />
                        Keanggotaan
                    </span>
                    <h1 className="mt-4 text-3xl font-bold text-neutral-800 sm:text-4xl dark:text-neutral-200">
                        Direktori Anggota
                    </h1>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
                        Daftar anggota PARI Pengda Jambi yang telah
                        terverifikasi dan aktif terdaftar sebagai anggota.
                    </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className={`${inputClass} pl-9`}
                            placeholder="Cari nama, nomor anggota, atau instansi..."
                        />
                    </div>
                    <select
                        value={kabupatenId}
                        onChange={(event) =>
                            setKabupatenId(
                                event.target.value
                                    ? Number(event.target.value)
                                    : '',
                            )
                        }
                        className={`${inputClass} sm:w-56`}
                    >
                        <option value="">Semua wilayah</option>
                        {kabupatenKota.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>

                <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                    {filteredMembers.length} anggota ditemukan
                </p>

                {filteredMembers.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-neutral-200 bg-white/60 p-16 text-center dark:border-neutral-700 dark:bg-neutral-900/40">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Tidak ada anggota yang cocok dengan pencarian.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredMembers.map((member) => {
                            const initials = member.full_name
                                .split(' ')
                                .slice(0, 2)
                                .map((part) => part.charAt(0))
                                .join('')
                                .toUpperCase();

                            return (
                                <div
                                    key={
                                        member.member_number ?? member.full_name
                                    }
                                    className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-5 transition hover:shadow-md dark:border-white/10 dark:bg-white/[.075]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-400/10 text-sm font-bold text-orange-400 dark:bg-orange-400/20">
                                            {member.photo ? (
                                                <img
                                                    src={`/storage/${member.photo}`}
                                                    alt={member.full_name}
                                                    className="size-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                initials
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-bold text-neutral-800 dark:text-neutral-200">
                                                {member.full_name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
