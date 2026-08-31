import { Head, usePage } from '@inertiajs/react';
import { BadgeCheck, IdCard, MapPin, Phone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Badge } from '@/components/ui/badge';
import { kartuAnggota } from '@/routes/dashboard';

interface MemberData {
    id: number;
    member_number: string | null;
    nir: string;
    nik: string | null;
    full_name: string;
    email: string;
    phone: string;
    photo: string | null;
    membership_status: string;
    verified_at: string | null;
}

const statusLabel = (status: string): string =>
    ({ active: 'Aktif', inactive: 'Nonaktif', suspended: 'Dibekukan' })[
        status
    ] ?? status;

export default function KartuAnggota() {
    const { auth } = usePage().props as {
        auth: { user: { member?: MemberData | null } };
    };

    const member = auth.user.member;

    const initials = (member?.full_name ?? '?')
        .split(' ')
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();

    const verifiedDate = member?.verified_at
        ? new Date(member.verified_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : null;

    return (
        <>
            <Head title="Kartu Anggota" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-full bg-indigo-500/10 dark:bg-indigo-500/20">
                            <IdCard className="size-7 text-indigo-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                                Kartu Anggota
                            </h1>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Kartu keanggotaan digital Anda
                            </p>
                        </div>
                    </div>
                </div>

                {member ? (
                    <div className="mx-auto w-full max-w-md">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-amber-500 p-6 text-neutral-50 shadow-xl shadow-indigo-500/20">
                            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/10" />
                            <div className="absolute -bottom-16 -left-8 size-48 rounded-full bg-white/10" />

                            <div className="relative flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-white/20 text-lg font-bold ring-2 ring-white/40">
                                        {member.photo ? (
                                            <img
                                                src={`/storage/${member.photo}`}
                                                alt={member.full_name}
                                                className="size-16 object-cover"
                                            />
                                        ) : (
                                            initials
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs tracking-wider text-indigo-200 uppercase">
                                            PARIPENDA
                                        </p>
                                        <h2 className="text-lg font-bold">
                                            {member.full_name}
                                        </h2>
                                        <p className="text-xs text-indigo-200">
                                            {member.email}
                                        </p>
                                    </div>
                                </div>
                                <QRCodeSVG
                                    value={String(member.id)}
                                    size={56}
                                    bgColor="transparent"
                                    fgColor="#ffffff"
                                />
                            </div>

                            <div className="relative mt-8 grid gap-3">
                                <div>
                                    <p className="text-xs tracking-wider text-indigo-200 uppercase">
                                        Nomor Anggota
                                    </p>
                                    <p className="font-mono text-xl font-bold tracking-wider">
                                        {member.member_number ?? '—'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs tracking-wider text-indigo-200 uppercase">
                                            NIR
                                        </p>
                                        <p className="font-mono text-sm font-semibold">
                                            {member.nir}
                                        </p>
                                    </div>
                                    <div className="flex items-end justify-end">
                                        <Badge className="border-transparent bg-white/20 text-neutral-50">
                                            {statusLabel(
                                                member.membership_status,
                                            )}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3 rounded-2xl border border-neutral-300/60 bg-neutral-100 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/[.075]">
                            <div className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                                <BadgeCheck className="size-4 shrink-0 text-indigo-500" />
                                <span className="font-semibold">Status:</span>
                                <Badge className="border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                    {statusLabel(member.membership_status)}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                                <BadgeCheck className="size-4 shrink-0 text-indigo-500" />
                                <span className="font-semibold">
                                    Terverifikasi:
                                </span>
                                {verifiedDate ?? '—'}
                            </div>
                            {member.nik && (
                                <div className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                                    <BadgeCheck className="size-4 shrink-0 text-indigo-500" />
                                    <span className="font-semibold">NIK:</span>
                                    {member.nik}
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                                <Phone className="size-4 shrink-0 text-indigo-500" />
                                <span className="font-semibold">Telepon:</span>
                                {member.phone}
                            </div>
                            {member.email && (
                                <div className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                                    <MapPin className="size-4 shrink-0 text-indigo-500" />
                                    <span className="font-semibold">
                                        Email:
                                    </span>
                                    {member.email}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto w-full max-w-md rounded-2xl border border-dashed border-neutral-300/70 bg-neutral-100 p-8 text-center dark:border-white/10 dark:bg-white/[.075]">
                        <IdCard className="mx-auto size-10 text-indigo-500" />
                        <h2 className="mt-3 text-lg font-bold text-neutral-800 dark:text-neutral-200">
                            Belum Ada Data Anggota
                        </h2>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Data anggota Anda belum tertaut di akun ini. Silakan
                            registrasi atau hubungi pengurus.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

KartuAnggota.layout = {
    breadcrumbs: [
        {
            title: 'Kartu Anggota',
            href: String(kartuAnggota()),
        },
    ],
};
