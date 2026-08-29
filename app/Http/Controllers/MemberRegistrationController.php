<?php

namespace App\Http\Controllers;

use App\Models\EducationCollege;
use App\Models\Instansi;
use App\Models\KabupatenKota;
use App\Models\Member;
use App\Models\MemberRegistration;
use App\Models\MemberRegistrationLog;
use App\Support\WebpConverter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class MemberRegistrationController extends Controller
{
    public const PENDING_STATUSES = ['submitted', 'under_review'];

    public function create(): Response
    {
        return Inertia::render('keanggotaan/registrasi', [
            'kabupatenKota' => KabupatenKota::orderBy('name')->get(['id', 'name']),
            'instansi' => Instansi::where('is_active', true)
                ->orderBy('nama')
                ->get(['id', 'nama', 'kabupaten_kota_id']),
            'educationColleges' => EducationCollege::orderBy('name')->get(['id', 'name', 'type', 'kind']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'digits:16'],
            'nir' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'max:255', 'lowercase', 'email'],
            'phone' => ['required', 'string', 'max:255'],
            'gender' => ['required', Rule::in(MemberRegistration::GENDERS)],
            'blood_type' => ['required', Rule::in(MemberRegistration::BLOOD_TYPES)],
            'religion' => ['required', Rule::in(MemberRegistration::RELIGIONS)],
            'birth_date' => ['required', 'date', 'before:today'],
            'home_address' => ['required', 'string', 'max:500'],
            'employment_status' => ['required', Rule::in(MemberRegistration::EMPLOYMENT_STATUSES)],
            'kabupaten_kota_id' => ['required', 'exists:kabupaten_kota,id'],
            'instansi_id' => ['required', 'exists:instansi,id'],
            'str_number' => ['required', 'string', 'max:255'],
            'str_status' => ['required', Rule::in(MemberRegistration::STR_STATUSES)],
            'str_expiry_date' => [
                'nullable',
                'date',
                'after_or_equal:today',
                Rule::requiredIf(fn () => $request->input('str_status') === 'sementara'),
            ],
            'education_college_id' => ['nullable', 'exists:education_colleges,id'],
            'education_institution' => ['required', 'string', 'max:255'],
            'education_level' => ['required', Rule::in(MemberRegistration::EDUCATION_LEVELS)],
            'diploma_number' => ['required', 'string', 'max:255'],
            'graduation_year' => ['required', 'integer', 'min:1960', 'max:'.now()->year],
            's2_program' => ['nullable', 'string', 'max:255'],
            's2_institution' => ['nullable', 'string', 'max:255'],
            's3_program' => ['nullable', 'string', 'max:255'],
            's3_institution' => ['nullable', 'string', 'max:255'],
            'diploma_file' => ['required', 'file', 'mimes:pdf', 'max:500'],
            'field' => ['required', Rule::in(MemberRegistration::FIELDS)],
            'photo' => ['required', 'image', 'mimes:jpeg,png,gif,webp', 'max:5120'],
        ]);

        $educationCollegeId = $request->filled('education_college_id')
            ? (int) $validated['education_college_id']
            : null;

        $errors = $this->duplicateErrors($validated['nik'], $validated['nir'], $validated['email']);

        if ($errors !== []) {
            return back()->withErrors($errors)->withInput();
        }

        $photo = $this->storeFoto($request->file('photo'));
        $diplomaFile = $this->storeDiploma($request->file('diploma_file'));

        $registration = MemberRegistration::create([
            'full_name' => $validated['full_name'],
            'nik' => $validated['nik'],
            'nir' => $validated['nir'],
            'email' => Str::lower($validated['email']),
            'phone' => $validated['phone'],
            'gender' => $validated['gender'],
            'blood_type' => $validated['blood_type'],
            'religion' => $validated['religion'],
            'birth_date' => $validated['birth_date'],
            'home_address' => $validated['home_address'],
            'photo' => $photo,
            'employment_status' => $validated['employment_status'],
            'kabupaten_kota_id' => $validated['kabupaten_kota_id'],
            'instansi_id' => $validated['instansi_id'],
            'str_number' => $validated['str_number'],
            'str_status' => $validated['str_status'],
            'str_expiry_date' => $validated['str_expiry_date'] ?? null,
            'education_college_id' => $educationCollegeId,
            'education_institution' => $educationCollegeId
                ? EducationCollege::findOrFail($educationCollegeId)->name
                : $validated['education_institution'],
            'education_level' => $validated['education_level'],
            'diploma_number' => $validated['diploma_number'],
            'graduation_year' => $validated['graduation_year'],
            's2_program' => $validated['s2_program'] ?? null,
            's2_institution' => $validated['s2_institution'] ?? null,
            's3_program' => $validated['s3_program'] ?? null,
            's3_institution' => $validated['s3_institution'] ?? null,
            'diploma_file' => $diplomaFile,
            'field' => $validated['field'],
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        MemberRegistrationLog::create([
            'registration_id' => $registration->id,
            'status' => 'submitted',
            'note' => 'Registrasi diajukan oleh calon anggota.',
            'performed_by' => null,
        ]);

        return redirect()
            ->route('keanggotaan.status', ['nir' => $registration->nir])
            ->with('toast', ['type' => 'success', 'message' => 'Registrasi berhasil dikirim. Gunakan NIR Anda untuk pengecekan status.']);
    }

    public function statusPage(Request $request): Response
    {
        $registration = null;

        if ($request->filled('nir')) {
            $registration = $this->lookup($request->string('nir')->toString());
        }

        return Inertia::render('keanggotaan/status', [
            'registration' => $registration,
        ]);
    }

    public function tracking(Request $request): Response|RedirectResponse
    {
        $validated = $request->validate([
            'nir' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'max:255'],
        ]);

        $registration = MemberRegistration::where('nir', $validated['nir'])->latest('id')->first();

        if (! $registration || Str::lower($registration->email) !== Str::lower($validated['email'])) {
            return back()->withErrors(['nir' => 'NIR atau email tidak cocok.']);
        }

        return Inertia::render('keanggotaan/status', [
            'registration' => $this->lookup($registration->nir),
        ]);
    }

    /**
     * @return array<string, mixed>|null
     */
    private function lookup(string $nir): ?array
    {
        $registration = MemberRegistration::with(['logs.performedBy', 'instansi.kabupatenKota', 'kabupatenKota'])
            ->where('nir', $nir)
            ->latest('id')
            ->first();

        if (! $registration) {
            return null;
        }

        return [
            'nir' => $registration->nir,
            'full_name' => $registration->full_name,
            'status' => $registration->status,
            'status_label' => $this->statusLabel($registration->status),
            'submitted_at' => $registration->submitted_at?->format('d M Y H:i'),
            'reviewed_at' => $registration->reviewed_at?->format('d M Y H:i'),
            'notes' => $registration->notes,
            'rejection_reason' => $registration->rejection_reason,
            'kabupaten_kota' => $registration->kabupatenKota?->name,
            'instansi' => $registration->instansi?->nama,
            'logs' => $registration->logs
                ->sortBy('created_at')
                ->values()
                ->map(fn (MemberRegistrationLog $log) => [
                    'status' => $log->status,
                    'status_label' => $this->statusLabel($log->status),
                    'note' => $log->note,
                    'created_at' => $log->created_at?->format('d M Y H:i'),
                    'performed_by' => $log->performedBy?->name,
                ]),
        ];
    }

    /**
     * @return array<string, string>
     */
    private function duplicateErrors(string $nik, string $nir, string $email): array
    {
        $errors = [];

        $nikBlocked = Member::where('nik', $nik)->exists()
            || MemberRegistration::whereIn('status', self::PENDING_STATUSES)->where('nik', $nik)->exists();

        $nirBlocked = Member::where('nir', $nir)->exists()
            || MemberRegistration::whereIn('status', self::PENDING_STATUSES)->where('nir', $nir)->exists();

        $emailBlocked = Member::where('email', $email)->exists()
            || MemberRegistration::whereIn('status', self::PENDING_STATUSES)->where('email', $email)->exists();

        if ($nikBlocked) {
            $errors['nik'] = 'NIK sudah terdaftar sebagai anggota atau masih dalam proses review.';
        }

        if ($nirBlocked) {
            $errors['nir'] = 'NIR sudah terdaftar sebagai anggota atau masih dalam proses review.';
        }

        if ($emailBlocked) {
            $errors['email'] = 'Email sudah terdaftar sebagai anggota atau masih dalam proses review.';
        }

        return $errors;
    }

    private function statusLabel(string $status): string
    {
        return match ($status) {
            'draft' => 'Draf',
            'submitted' => 'Diajukan',
            'under_review' => 'Dalam Review',
            'revision' => 'Revisi Diperlukan',
            'approved' => 'Disetujui',
            'rejected' => 'Ditolak',
            default => ucfirst($status),
        };
    }

    private function storeFoto(UploadedFile $file): string
    {
        $data = $file->get();

        if ($data === false) {
            abort(422, 'Gambar tidak dapat dibaca.');
        }

        try {
            return WebpConverter::convert($data, 'registrasi');
        } catch (Throwable $e) {
            abort(422, 'Gambar tidak dapat diproses menjadi WebP.');
        }
    }

    private function storeDiploma(UploadedFile $file): string
    {
        $data = $file->get();

        if ($data === false) {
            abort(422, 'Ijazah tidak dapat dibaca.');
        }

        $filename = Str::uuid().'.pdf';

        Storage::disk('public')->put('diplomas/'.$filename, $data);

        return 'diplomas/'.$filename;
    }
}
