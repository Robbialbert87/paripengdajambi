import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Camera,
    CheckCircle2,
    CreditCard,
    FileText,
    GraduationCap,
    Mail,
    Phone,
    Send,
    Stethoscope,
    Upload,
    UserRound,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import SearchableSelect from '@/components/searchable-select';
import { status } from '@/routes/keanggotaan';
import { store } from '@/routes/keanggotaan/registrasi';

interface KabupatenKotaOption {
    id: number;
    name: string;
}

interface InstansiOption {
    id: number;
    nama: string;
    kabupaten_kota_id: number | null;
}

interface EducationCollegeOption {
    id: number;
    name: string;
    type: string;
    kind: string;
}

interface RegistrasiProps {
    kabupatenKota: KabupatenKotaOption[];
    instansi: InstansiOption[];
    educationColleges: EducationCollegeOption[];
}

const modalityOptions = [
    { value: 'cr', label: 'CR', detail: 'Computed Radiography' },
    { value: 'dr', label: 'DR', detail: 'Digital Radiography' },
    { value: 'ct_scan', label: 'CT Scan', detail: 'Computed Tomography' },
    { value: 'mri', label: 'MRI', detail: 'Magnetic Resonance Imaging' },
    { value: 'usg', label: 'USG', detail: 'Ultrasonography' },
    { value: 'mamografi', label: 'Mamograf', detail: 'Mammography' },
    { value: 'fluoroskopi', label: 'Fluoroskopi', detail: 'Fluoroscopy' },
    {
        value: 'kedokteran_nuklir',
        label: 'Kedokteran Nuklir',
        detail: 'Nuclear Medicine',
    },
];

const inputClass =
    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200';

const labelClass =
    'mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300';

const STEP_FIELDS: Record<number, string[]> = {
    1: [
        'full_name',
        'nik',
        'nir',
        'email',
        'phone',
        'gender',
        'blood_type',
        'religion',
        'birth_date',
        'home_address',
        'photo',
    ],
    2: [
        'employment_status',
        'kabupaten_kota_id',
        'instansi_id',
        'str_number',
        'str_status',
        'str_expiry_date',
    ],
    3: [
        'education_college_id',
        'education_institution',
        'education_level',
        'diploma_number',
        'graduation_year',
        's2_program',
        's2_institution',
        's3_program',
        's3_institution',
        'diploma_file',
        'field',
    ],
};

const stepOfError = (key: string): number => {
    const entry = Object.entries(STEP_FIELDS).find(([, fields]) =>
        fields.includes(key),
    );

    return entry ? Number(entry[0]) : 1;
};

const firstErrorStep = (errors: Record<string, string>): number => {
    const keys = Object.keys(errors);

    if (keys.length === 0) {
        return 1;
    }

    return Math.min(...keys.map(stepOfError));
};

const steps = [
    {
        key: 1,
        label: 'Data Diri',
        icon: UserRound,
        description: 'Identitas pribadi',
    },
    {
        key: 2,
        label: 'Data Pekerjaan',
        icon: Stethoscope,
        description: 'STR & tempat kerja',
    },
    {
        key: 3,
        label: 'Data Pendidikan',
        icon: GraduationCap,
        description: 'Ijazah & keahlian',
    },
];

export default function Registrasi({
    kabupatenKota,
    instansi,
    educationColleges,
}: RegistrasiProps) {
    const { errors: pageErrors } = usePage().props as {
        errors: Record<string, string>;
    };

    const [step, setStep] = useState(() => firstErrorStep(pageErrors));
    const [kabupatenId, setKabupatenId] = useState<number | ''>('');
    const [instansiId, setInstansiId] = useState<number | null>(null);
    const [instansiError, setInstansiError] = useState('');
    const [strStatus, setStrStatus] = useState('');
    const [educationChoice, setEducationChoice] = useState('');
    const [educationInstitution, setEducationInstitution] = useState('');
    const [selectedModalities, setSelectedModalities] = useState<string[]>([]);
    const [modalityError, setModalityError] = useState('');

    const [prevErrors, setPrevErrors] = useState(pageErrors);

    if (pageErrors !== prevErrors) {
        setPrevErrors(pageErrors);

        if (Object.keys(pageErrors).length > 0) {
            const target = firstErrorStep(pageErrors);

            setStep((current) => (target !== current ? target : current));
        }
    }

    const filteredInstansi = useMemo(
        () => instansi.filter((item) => item.kabupaten_kota_id === kabupatenId),
        [instansi, kabupatenId],
    );

    const collegeGroups = useMemo(() => {
        const order = [
            'politeknik',
            'universitas',
            'institut',
            'sekolah_tinggi',
            'akademi',
        ];
        const labels: Record<string, string> = {
            politeknik: 'Politeknik',
            universitas: 'Universitas',
            institut: 'Institut',
            sekolah_tinggi: 'Sekolah Tinggi',
            akademi: 'Akademi',
        };

        return order
            .map((kind) => ({
                kind,
                label: labels[kind] ?? kind,
                items: educationColleges.filter(
                    (college) => college.kind === kind,
                ),
            }))
            .filter((group) => group.items.length > 0);
    }, [educationColleges]);

    const validateStep = (target: number): boolean => {
        const nodes = document.querySelectorAll(
            `[data-step="${target}"] input, [data-step="${target}"] select, [data-step="${target}"] textarea`,
        );

        for (const el of Array.from(nodes)) {
            if (
                el instanceof HTMLInputElement ||
                el instanceof HTMLSelectElement ||
                el instanceof HTMLTextAreaElement
            ) {
                if (!el.checkValidity()) {
                    el.reportValidity();

                    return false;
                }
            }
        }

        if (target === 2 && kabupatenId !== '' && instansiId === null) {
            setInstansiError('Pilih instansi dari daftar terlebih dahulu.');

            return false;
        }

        if (target === 2 && selectedModalities.length === 0) {
            setModalityError('Pilih minimal satu modality yang digunakan.');

            return false;
        }

        return true;
    };

    const next = () => {
        if (!validateStep(step)) {
            return;
        }

        setStep((current) => Math.min(current + 1, 3));
    };

    const back = () => setStep((current) => Math.max(current - 1, 1));

    return (
        <>
            <Head title="Registrasi Anggota" />

            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
                {/* Heading */}
                <div className="text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/60 px-4 py-1 text-xs font-bold text-orange-600 dark:border-orange-800/50 dark:bg-orange-900/20 dark:text-orange-400">
                        <CreditCard className="size-3.5" />
                        Pendaftaran Keanggotaan
                    </span>
                    <h1 className="mt-4 text-3xl font-bold text-neutral-800 sm:text-4xl dark:text-neutral-200">
                        Daftar Anggota PARI Pengda Jambi
                    </h1>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
                        Lengkapi formulir berikut untuk mengajukan keanggotaan.
                        Setelah terkirim, Anda dapat menggunakan NIR untuk
                        memantau status pengajuan.
                    </p>
                </div>

                {/* Stepper */}
                <div className="mt-10 flex items-center justify-center">
                    <ol className="flex w-full max-w-lg items-center">
                        {steps.map((item, index) => {
                            const isActive = step === item.key;
                            const isDone = step > item.key;

                            return (
                                <li
                                    key={item.key}
                                    className={`flex items-center ${
                                        index < steps.length - 1 ? 'flex-1' : ''
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (item.key < step) {
                                                setStep(item.key);
                                            }
                                        }}
                                        disabled={item.key > step}
                                        className="group flex flex-col items-center"
                                    >
                                        <span
                                            className={`flex size-10 items-center justify-center rounded-full border-2 transition ${
                                                isDone
                                                    ? 'border-orange-400 bg-orange-400 text-white'
                                                    : isActive
                                                      ? 'border-orange-400 bg-orange-50 text-orange-500 dark:bg-orange-900/30'
                                                      : 'border-neutral-300 bg-white text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800'
                                            }`}
                                        >
                                            {isDone ? (
                                                <CheckCircle2 className="size-5" />
                                            ) : (
                                                <item.icon className="size-5" />
                                            )}
                                        </span>
                                        <span
                                            className={`mt-2 hidden text-[11px] font-semibold sm:block ${
                                                isActive
                                                    ? 'text-orange-500'
                                                    : 'text-neutral-400'
                                            }`}
                                        >
                                            {item.label}
                                        </span>
                                    </button>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`mx-2 h-0.5 flex-1 rounded-full sm:mt-5 ${
                                                step > item.key
                                                    ? 'bg-orange-400'
                                                    : 'bg-neutral-300 dark:bg-neutral-700'
                                            }`}
                                        />
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
                    {/* Side info */}
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 dark:border-white/10 dark:bg-white/[.075]">
                            <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                Informasi Pendaftaran
                            </h2>
                            <ul className="mt-4 space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                                <li className="flex gap-3">
                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-orange-400" />
                                    Formulir terdiri dari 3 tahap: Data Diri,
                                    Data Pekerjaan, dan Data Pendidikan.
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-orange-400" />
                                    NIR (Nomor Identitas Radiografer) Anda
                                    berfungsi sebagai nomor registrasi.
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-orange-400" />
                                    Siapkan scan ijazah PDF (maks 500 KB) dan
                                    pas foto memakai jas PARI.
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-orange-400" />
                                    Pengurus akan memverifikasi kelengkapan dan
                                    keabsahan data.
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 dark:border-white/10 dark:bg-white/[.075]">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Sudah mengirim formulir?{' '}
                                <Link
                                    href={status()}
                                    className="font-semibold text-orange-500 underline-offset-2 hover:underline"
                                >
                                    Cek status pendaftaran
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="rounded-2xl border border-neutral-300/60 bg-neutral-100 p-6 sm:p-8 dark:border-white/10 dark:bg-white/[.075]">
                        <Form
                            {...store.form()}
                            disableWhileProcessing
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {Object.keys(errors).length > 0 && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-400">
                                            Formulir belum berhasil dikirim.
                                            Periksa kembali kolom yang ditandai.
                                        </div>
                                    )}

                                    {/* STEP 1 — Data Diri */}
                                    <section
                                        data-step="1"
                                        className={`space-y-5 ${step === 1 ? '' : 'hidden'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-9 items-center justify-center rounded-xl bg-orange-100 text-orange-500 dark:bg-orange-900/30">
                                                <UserRound className="size-4" />
                                            </span>
                                            <div>
                                                <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                                    Tahap 1 — Data Diri
                                                </h2>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    Identitas sesuai dokumen
                                                    resmi.
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="full_name"
                                                className={labelClass}
                                            >
                                                Nama Lengkap
                                            </label>
                                            <input
                                                id="full_name"
                                                name="full_name"
                                                type="text"
                                                required
                                                autoComplete="name"
                                                placeholder="Masukkan nama lengkap sesuai identitas"
                                                className={inputClass}
                                            />
                                            {errors.full_name && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.full_name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="nik"
                                                    className={labelClass}
                                                >
                                                    NIK
                                                </label>
                                                <input
                                                    id="nik"
                                                    name="nik"
                                                    type="text"
                                                    inputMode="numeric"
                                                    required
                                                    maxLength={16}
                                                    pattern="\d{16}"
                                                    title="NIK harus terdiri dari 16 digit angka"
                                                    placeholder="16 digit NIK"
                                                    className={inputClass}
                                                />
                                                {errors.nik && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.nik}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="birth_date"
                                                    className={labelClass}
                                                >
                                                    Tanggal Lahir
                                                </label>
                                                <input
                                                    id="birth_date"
                                                    name="birth_date"
                                                    type="date"
                                                    required
                                                    className={inputClass}
                                                />
                                                {errors.birth_date && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.birth_date}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="gender"
                                                    className={labelClass}
                                                >
                                                    Jenis Kelamin
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-700 has-[:checked]:border-orange-400 has-[:checked]:bg-orange-50 has-[:checked]:text-orange-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:has-[:checked]:bg-orange-900/30">
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="male"
                                                            required
                                                            className="hidden"
                                                        />
                                                        Laki-laki
                                                    </label>
                                                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-700 has-[:checked]:border-orange-400 has-[:checked]:bg-orange-50 has-[:checked]:text-orange-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:has-[:checked]:bg-orange-900/30">
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="female"
                                                            required
                                                            className="hidden"
                                                        />
                                                        Perempuan
                                                    </label>
                                                </div>
                                                {errors.gender && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.gender}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="blood_type"
                                                    className={labelClass}
                                                >
                                                    Golongan Darah
                                                </label>
                                                <select
                                                    id="blood_type"
                                                    name="blood_type"
                                                    required
                                                    className={inputClass}
                                                >
                                                    <option value="">
                                                        Pilih...
                                                    </option>
                                                    <option value="A">A</option>
                                                    <option value="B">B</option>
                                                    <option value="AB">
                                                        AB
                                                    </option>
                                                    <option value="O">O</option>
                                                </select>
                                                {errors.blood_type && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.blood_type}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="religion"
                                                className={labelClass}
                                            >
                                                Agama
                                            </label>
                                            <select
                                                id="religion"
                                                name="religion"
                                                required
                                                className={inputClass}
                                            >
                                                <option value="">
                                                    Pilih...
                                                </option>
                                                <option value="islam">
                                                    Islam
                                                </option>
                                                <option value="kristen_protestan">
                                                    Kristen Protestan
                                                </option>
                                                <option value="katolik">
                                                    Katolik
                                                </option>
                                                <option value="hindu">
                                                    Hindu
                                                </option>
                                                <option value="buddha">
                                                    Buddha
                                                </option>
                                                <option value="konghucu">
                                                    Konghucu
                                                </option>
                                                <option value="lainnya">
                                                    Lainnya
                                                </option>
                                            </select>
                                            {errors.religion && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.religion}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="home_address"
                                                className={labelClass}
                                            >
                                                Alamat Tempat Tinggal
                                            </label>
                                            <textarea
                                                id="home_address"
                                                name="home_address"
                                                required
                                                rows={2}
                                                maxLength={500}
                                                placeholder="Alamat lengkap saat ini"
                                                className={inputClass}
                                            />
                                            {errors.home_address && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.home_address}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="nir"
                                                    className={labelClass}
                                                >
                                                    NIR / Nomor Identitas
                                                    Radiografer
                                                </label>
                                                <input
                                                    id="nir"
                                                    name="nir"
                                                    type="text"
                                                    required
                                                    placeholder="Contoh: 1571041103019"
                                                    className={inputClass}
                                                />
                                                {errors.nir && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.nir}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="phone"
                                                    className={labelClass}
                                                >
                                                    No. HP / WhatsApp
                                                </label>
                                                <div className="relative">
                                                    <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                                                    <input
                                                        id="phone"
                                                        name="phone"
                                                        type="tel"
                                                        required
                                                        autoComplete="tel"
                                                        placeholder="Contoh: 081234567890"
                                                        className={`${inputClass} pl-10`}
                                                    />
                                                </div>
                                                {errors.phone && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className={labelClass}
                                            >
                                                Email
                                            </label>
                                            <div className="relative">
                                                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    autoComplete="email"
                                                    placeholder="email@contoh.com"
                                                    className={`${inputClass} pl-10`}
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="photo"
                                                className={labelClass}
                                            >
                                                Pas Foto
                                            </label>
                                            <div className="flex items-center gap-4 rounded-xl border border-dashed border-neutral-300 bg-white/60 p-4 dark:border-neutral-700 dark:bg-neutral-900/40">
                                                <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-900/30">
                                                    <Camera className="size-6 text-orange-400" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <input
                                                        id="photo"
                                                        name="photo"
                                                        type="file"
                                                        required
                                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                                        className="block w-full cursor-pointer text-xs text-neutral-500 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-orange-400 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-orange-500 dark:text-neutral-400"
                                                    />
                                                    <p className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
                                                        <Upload className="size-3" />
                                                        JPG / PNG / GIF / WebP,
                                                        maks 5 MB. Gunakan jas
                                                        PARI dengan background
                                                        merah.
                                                    </p>
                                                </div>
                                            </div>
                                            {errors.photo && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.photo}
                                                </p>
                                            )}
                                        </div>
                                    </section>

                                    {/* STEP 2 — Data Pekerjaan */}
                                    <section
                                        data-step="2"
                                        className={`space-y-5 ${step === 2 ? '' : 'hidden'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-9 items-center justify-center rounded-xl bg-orange-100 text-orange-500 dark:bg-orange-900/30">
                                                <Stethoscope className="size-4" />
                                            </span>
                                            <div>
                                                <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                                    Tahap 2 — Data Pekerjaan
                                                </h2>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    Tempat bertugas dan STR.
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="employment_status"
                                                className={labelClass}
                                            >
                                                Status Kepegawaian
                                            </label>
                                            <select
                                                id="employment_status"
                                                name="employment_status"
                                                required
                                                className={inputClass}
                                            >
                                                <option value="">
                                                    Pilih...
                                                </option>
                                                <optgroup label="Pegawai Pemerintah & BUMN">
                                                    <option value="pns">
                                                        PNS
                                                    </option>
                                                    <option value="bumn">
                                                        BUMN
                                                    </option>
                                                    <option value="tni">
                                                        TNI
                                                    </option>
                                                    <option value="polri">
                                                        POLRI
                                                    </option>
                                                </optgroup>
                                                <optgroup label="Lainnya">
                                                    <option value="swasta_non_pns">
                                                        Swasta / Non PNS
                                                    </option>
                                                </optgroup>
                                            </select>
                                            {errors.employment_status && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.employment_status}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="kabupaten_kota_id"
                                                    className={labelClass}
                                                >
                                                    Kabupaten / Kota Tempat
                                                    Bertugas
                                                </label>
                                                <select
                                                    id="kabupaten_kota_id"
                                                    name="kabupaten_kota_id"
                                                    required
                                                    value={kabupatenId}
                                                    onChange={(e) => {
                                                        setKabupatenId(
                                                            e.target.value
                                                                ? Number(
                                                                      e.target
                                                                          .value,
                                                                  )
                                                                : '',
                                                        );
                                                        setInstansiId(null);
                                                        setInstansiError('');
                                                    }}
                                                    className={inputClass}
                                                >
                                                    <option value="">
                                                        Pilih wilayah...
                                                    </option>
                                                    {kabupatenKota.map(
                                                        (option) => (
                                                            <option
                                                                key={option.id}
                                                                value={
                                                                    option.id
                                                                }
                                                            >
                                                                {option.name}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                                {errors.kabupaten_kota_id && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {
                                                            errors.kabupaten_kota_id
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div data-step="2">
                                                <label
                                                    htmlFor="instansi_id"
                                                    className={labelClass}
                                                >
                                                    Instansi / Tempat Bekerja
                                                </label>
                                                <SearchableSelect
                                                    options={filteredInstansi.map(
                                                        (option) => ({
                                                            value: option.id,
                                                            label: option.nama,
                                                        }),
                                                    )}
                                                    value={instansiId}
                                                    onValueChange={(value) => {
                                                        setInstansiId(
                                                            value as
                                                                number | null,
                                                        );
                                                        setInstansiError('');
                                                    }}
                                                    name="instansi_id"
                                                    required={
                                                        kabupatenId !== ''
                                                    }
                                                    disabled={
                                                        kabupatenId === ''
                                                    }
                                                    placeholder="Ketik nama instansi untuk mencari..."
                                                    emptyText={
                                                        kabupatenId === ''
                                                            ? 'Ketik nama instansi untuk mencari...'
                                                            : 'Tidak ada instansi yang cocok'
                                                    }
                                                    className={`${inputClass} pr-8 pl-10`}
                                                    icon={
                                                        <Building2 className="size-4 text-neutral-400" />
                                                    }
                                                />
                                                {(instansiError ||
                                                    errors.instansi_id) && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {instansiError ??
                                                            errors.instansi_id}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="str_number"
                                                    className={labelClass}
                                                >
                                                    Nomor STR
                                                </label>
                                                <input
                                                    id="str_number"
                                                    name="str_number"
                                                    type="text"
                                                    required
                                                    placeholder="Nomor Surat Tanda Registrasi"
                                                    className={inputClass}
                                                />
                                                {errors.str_number && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.str_number}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="str_status"
                                                    className={labelClass}
                                                >
                                                    Status STR
                                                </label>
                                                <select
                                                    id="str_status"
                                                    name="str_status"
                                                    required
                                                    value={strStatus}
                                                    onChange={(e) =>
                                                        setStrStatus(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={inputClass}
                                                >
                                                    <option value="">
                                                        Pilih...
                                                    </option>
                                                    <option value="sementara">
                                                        STR Sementara
                                                    </option>
                                                    <option value="seumur_hidup">
                                                        STR Seumur Hidup
                                                    </option>
                                                </select>
                                                {errors.str_status && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.str_status}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {strStatus === 'sementara' && (
                                            <div>
                                                <label
                                                    htmlFor="str_expiry_date"
                                                    className={labelClass}
                                                >
                                                    Masa Berlaku Sampai
                                                </label>
                                                <input
                                                    id="str_expiry_date"
                                                    name="str_expiry_date"
                                                    type="date"
                                                    required={
                                                        strStatus ===
                                                        'sementara'
                                                    }
                                                    className={inputClass}
                                                />
                                                {errors.str_expiry_date && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.str_expiry_date}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <div>
                                            <label className={labelClass}>
                                                Modality / Jenis Alat yang
                                                Digunakan
                                            </label>
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {modalityOptions.map(
                                                    (option) => {
                                                        const checked =
                                                            selectedModalities.includes(
                                                                option.value,
                                                            );

                                                        return (
                                                            <label
                                                                key={
                                                                    option.value
                                                                }
                                                                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition has-[:checked]:border-orange-400 has-[:checked]:bg-orange-50 dark:has-[:checked]:bg-orange-900/30 ${
                                                                    checked
                                                                        ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/30'
                                                                        : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    name="modalities[]"
                                                                    value={
                                                                        option.value
                                                                    }
                                                                    checked={
                                                                        checked
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        setModalityError(
                                                                            '',
                                                                        );
                                                                        setSelectedModalities(
                                                                            (
                                                                                current,
                                                                            ) =>
                                                                                e
                                                                                    .target
                                                                                    .checked
                                                                                    ? [
                                                                                          ...current,
                                                                                          option.value,
                                                                                      ]
                                                                                    : current.filter(
                                                                                          (
                                                                                              value,
                                                                                          ) =>
                                                                                              value !==
                                                                                              option.value,
                                                                                      ),
                                                                        );
                                                                    }}
                                                                    className="size-4 shrink-0 rounded border-neutral-300 text-orange-500 focus:ring-orange-500/20 dark:border-neutral-600"
                                                                />
                                                                <span className="flex flex-col">
                                                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </span>
                                                                    {option.detail && (
                                                                        <span className="text-[11px] text-neutral-400">
                                                                            {
                                                                                option.detail
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </label>
                                                        );
                                                    },
                                                )}
                                            </div>
                                            {(modalityError ||
                                                errors.modalities) && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {modalityError ??
                                                        errors.modalities}
                                                </p>
                                            )}
                                        </div>
                                    </section>

                                    {/* STEP 3 — Data Pendidikan */}
                                    <section
                                        data-step="3"
                                        className={`space-y-5 ${step === 3 ? '' : 'hidden'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-9 items-center justify-center rounded-xl bg-orange-100 text-orange-500 dark:bg-orange-900/30">
                                                <GraduationCap className="size-4" />
                                            </span>
                                            <div>
                                                <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                                    Tahap 3 — Data Pendidikan
                                                </h2>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    Riwayat pendidikan dan
                                                    keahlian.
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="education_college_id"
                                                className={labelClass}
                                            >
                                                Institusi Pendidikan Radiologi
                                            </label>
                                            <input
                                                type="hidden"
                                                name="education_institution"
                                                value={educationInstitution}
                                            />
                                            <input
                                                type="hidden"
                                                name="education_college_id"
                                                value={
                                                    educationChoice !== 'other'
                                                        ? educationChoice
                                                        : ''
                                                }
                                            />
                                            <select
                                                id="education_college_id"
                                                required
                                                value={educationChoice}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    setEducationChoice(value);
                                                    setEducationInstitution(
                                                        value === 'other'
                                                            ? ''
                                                            : (educationColleges.find(
                                                                  (college) =>
                                                                      String(
                                                                          college.id,
                                                                      ) ===
                                                                      value,
                                                              )?.name ?? ''),
                                                    );
                                                }}
                                                className={inputClass}
                                            >
                                                <option value="">
                                                    Pilih...
                                                </option>
                                                {collegeGroups.map((group) => (
                                                    <optgroup
                                                        key={group.kind}
                                                        label={group.label}
                                                    >
                                                        {group.items.map(
                                                            (college) => (
                                                                <option
                                                                    key={
                                                                        college.id
                                                                    }
                                                                    value={
                                                                        college.id
                                                                    }
                                                                >
                                                                    {
                                                                        college.name
                                                                    }
                                                                </option>
                                                            ),
                                                        )}
                                                    </optgroup>
                                                ))}
                                                <option value="other">
                                                    Lainnya (tulis manual)
                                                </option>
                                            </select>
                                            {errors.education_college_id && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {
                                                        errors.education_college_id
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {educationChoice === 'other' && (
                                            <div>
                                                <label
                                                    htmlFor="education_institution"
                                                    className={labelClass}
                                                >
                                                    Nama Institusi (Lainnya)
                                                </label>
                                                <input
                                                    id="education_institution"
                                                    name="education_institution"
                                                    type="text"
                                                    required
                                                    maxLength={255}
                                                    placeholder="Nama institusi/universitas"
                                                    value={educationInstitution}
                                                    onChange={(e) =>
                                                        setEducationInstitution(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={inputClass}
                                                />
                                                {errors.education_institution && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {
                                                            errors.education_institution
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="education_level"
                                                    className={labelClass}
                                                >
                                                    Jenjang Pendidikan
                                                </label>
                                                <select
                                                    id="education_level"
                                                    name="education_level"
                                                    required
                                                    className={inputClass}
                                                >
                                                    <option value="">
                                                        Pilih...
                                                    </option>
                                                    <option value="d3">
                                                        D3
                                                    </option>
                                                    <option value="d4">
                                                        D4
                                                    </option>
                                                </select>
                                                {errors.education_level && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.education_level}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="graduation_year"
                                                    className={labelClass}
                                                >
                                                    Tahun Lulus
                                                </label>
                                                <input
                                                    id="graduation_year"
                                                    name="graduation_year"
                                                    type="number"
                                                    required
                                                    min={1960}
                                                    max={new Date().getFullYear()}
                                                    placeholder="Contoh: 2024"
                                                    className={inputClass}
                                                />
                                                {errors.graduation_year && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.graduation_year}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="diploma_number"
                                                    className={labelClass}
                                                >
                                                    Nomor Ijazah
                                                </label>
                                                <input
                                                    id="diploma_number"
                                                    name="diploma_number"
                                                    type="text"
                                                    required
                                                    placeholder="Nomor ijazah"
                                                    className={inputClass}
                                                />
                                                {errors.diploma_number && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.diploma_number}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="field"
                                                    className={labelClass}
                                                >
                                                    Bidang Keprofesian
                                                </label>
                                                <select
                                                    id="field"
                                                    name="field"
                                                    required
                                                    className={inputClass}
                                                >
                                                    <option value="">
                                                        Pilih...
                                                    </option>
                                                    <option value="radiodiagnostik">
                                                        Radiodiagnostik
                                                    </option>
                                                    <option value="radioterapi">
                                                        Radioterapi
                                                    </option>
                                                    <option value="intervensi_radiologi">
                                                        Intervensi Radiologi
                                                    </option>
                                                    <option value="kedokteran_nuklir">
                                                        Kedokteran Nuklir
                                                    </option>
                                                </select>
                                                {errors.field && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {errors.field}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-neutral-200 bg-white/60 p-4 dark:border-neutral-700 dark:bg-neutral-900/40">
                                            <p className="mb-3 flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400">
                                                <GraduationCap className="size-3.5" />
                                                Pendidikan Lanjutan (opsional)
                                            </p>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <input
                                                    name="s2_program"
                                                    type="text"
                                                    maxLength={255}
                                                    placeholder="S2 — Program/Prodi"
                                                    className={inputClass}
                                                />
                                                <input
                                                    name="s2_institution"
                                                    type="text"
                                                    maxLength={255}
                                                    placeholder="S2 — Institusi"
                                                    className={inputClass}
                                                />
                                                <input
                                                    name="s3_program"
                                                    type="text"
                                                    maxLength={255}
                                                    placeholder="S3 — Program/Prodi"
                                                    className={inputClass}
                                                />
                                                <input
                                                    name="s3_institution"
                                                    type="text"
                                                    maxLength={255}
                                                    placeholder="S3 — Institusi"
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="diploma_file"
                                                className={labelClass}
                                            >
                                                Scan Ijazah
                                            </label>
                                            <div className="flex items-center gap-4 rounded-xl border border-dashed border-neutral-300 bg-white/60 p-4 dark:border-neutral-700 dark:bg-neutral-900/40">
                                                <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-900/30">
                                                    <FileText className="size-8 text-orange-400" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <input
                                                        id="diploma_file"
                                                        name="diploma_file"
                                                        type="file"
                                                        required
                                                        accept="application/pdf"
                                                        className="block w-full cursor-pointer text-xs text-neutral-500 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-orange-400 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-orange-500 dark:text-neutral-400"
                                                    />
                                                    <p className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
                                                        <Upload className="size-3" />
                                                        PDF, maks 500 KB
                                                    </p>
                                                </div>
                                            </div>
                                            {errors.diploma_file && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.diploma_file}
                                                </p>
                                            )}
                                        </div>
                                    </section>

                                    {/* Navigation */}
                                    <div className="flex items-center justify-between gap-3 pt-2">
                                        {step > 1 ? (
                                            <button
                                                type="button"
                                                onClick={back}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-bold text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700/60"
                                            >
                                                Kembali
                                            </button>
                                        ) : (
                                            <span className="w-24" />
                                        )}

                                        {step < 3 ? (
                                            <button
                                                type="button"
                                                onClick={next}
                                                className="inline-flex w-40 items-center justify-center gap-2 rounded-xl bg-orange-400 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                                            >
                                                Lanjut
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex w-48 items-center justify-center gap-2 rounded-xl bg-orange-400 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-500 disabled:opacity-50 dark:bg-orange-500 dark:hover:bg-orange-600"
                                            >
                                                <Send className="size-4" />
                                                {processing
                                                    ? 'Mengirim...'
                                                    : 'Kirim Formulir Registrasi'}
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
