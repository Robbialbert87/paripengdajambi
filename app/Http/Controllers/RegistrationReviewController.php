<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\MemberRegistration;
use App\Models\MemberRegistrationLog;
use App\Support\MemberAccountActivator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class RegistrationReviewController extends Controller
{
    public const STATUSES = MemberRegistration::STATUSES;

    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        $validStatuses = self::STATUSES;

        if ($status !== '' && ! in_array($status, $validStatuses, true)) {
            abort(404);
        }

        $registrations = MemberRegistration::query()
            ->with(['instansi.kabupatenKota', 'kabupatenKota'])
            ->where('status', '!=', 'approved')
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->orderByDesc('created_at')
            ->get();

        $counts = collect(self::STATUSES)
            ->reject(fn (string $item) => $item === 'approved')
            ->mapWithKeys(fn (string $item) => [
                $item => MemberRegistration::where('status', $item)->count(),
            ])
            ->all();

        return Inertia::render('dashboard/verifikasi', [
            'registrations' => $registrations->map(
                fn (MemberRegistration $registration) => $this->toListItem($registration),
            ),
            'counts' => $counts,
            'currentStatus' => $status,
        ]);
    }

    public function show(MemberRegistration $registration): Response
    {
        return Inertia::render('dashboard/verifikasi/detail', [
            'registration' => $this->toDetailItem(
                $registration->load(['instansi.kabupatenKota', 'kabupatenKota', 'member', 'educationCollege', 'logs.performedBy']),
            ),
        ]);
    }

    public function process(MemberRegistration $registration): RedirectResponse
    {
        abort_if($registration->status !== 'submitted', 409, 'Registrasi tidak dapat diproses pada status ini.');

        $registration->update([
            'status' => 'under_review',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        $this->log($registration, 'under_review', 'Registrasi sedang direview oleh admin.');

        return $this->backToDetail($registration)->with('toast', [
            'type' => 'success',
            'message' => 'Registrasi masuk ke tahap review.',
        ]);
    }

    public function approve(MemberRegistration $registration): RedirectResponse
    {
        abort_if($registration->status !== 'under_review', 409, 'Registrasi harus diproses terlebih dahulu.');

        $member = Member::create([
            'nir' => $registration->nir,
            'nik' => $registration->nik,
            'full_name' => $registration->full_name ?? $registration->nir,
            'email' => $registration->email,
            'phone' => $registration->phone,
            'photo' => $registration->photo,
            'membership_status' => 'active',
            'directory_visible' => true,
            'verified_at' => now(),
            'verified_by' => auth()->id(),
        ]);

        $registration->update([
            'member_id' => $member->id,
            'status' => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        $accountMessage = null;

        try {
            MemberAccountActivator::activate($member);
            $accountMessage = ' Akun dibuat. Login dengan NIR/email, password awal: NIR.';
        } catch (Throwable $e) {
            report($e);
            $accountMessage = ' Gagal membuat akun, silakan bantu buat akun secara manual.';
        }

        $this->log($registration, 'approved', 'Registrasi disetujui. Anggota menjadi aktif.');

        return $this->backToDetail($registration)->with('toast', [
            'type' => 'success',
            'message' => 'Registrasi disetujui. Nomor anggota: '.$member->member_number.'.'.$accountMessage,
        ]);
    }

    public function reject(Request $request, MemberRegistration $registration): RedirectResponse
    {
        abort_if(! in_array($registration->status, ['under_review', 'submitted'], true), 409, 'Registrasi tidak dapat ditolak pada status ini.');

        $validated = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:1000'],
        ]);

        $registration->update([
            'status' => 'rejected',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        $this->log($registration, 'rejected', 'Registrasi ditolak: '.$validated['rejection_reason']);

        return $this->backToDetail($registration)->with('toast', [
            'type' => 'success',
            'message' => 'Registrasi ditolak.',
        ]);
    }

    public function requestRevision(Request $request, MemberRegistration $registration): RedirectResponse
    {
        abort_if(! in_array($registration->status, ['under_review', 'submitted'], true), 409, 'Registrasi tidak dapat diminta revisi pada status ini.');

        $validated = $request->validate([
            'notes' => ['required', 'string', 'max:1000'],
        ]);

        $registration->update([
            'status' => 'revision',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
            'notes' => $validated['notes'],
        ]);

        $this->log($registration, 'revision', 'Revisi diperlukan: '.$validated['notes']);

        return $this->backToDetail($registration)->with('toast', [
            'type' => 'success',
            'message' => 'Permintaan revisi dikirim ke pemohon.',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function toListItem(MemberRegistration $registration): array
    {
        return [
            'id' => $registration->id,
            'full_name' => $registration->full_name,
            'nir' => $registration->nir,
            'status' => $registration->status,
            'status_label' => $this->statusLabel($registration->status),
            'kabupaten_kota' => $registration->kabupatenKota?->name,
            'instansi' => $registration->instansi?->nama,
            'submitted_at' => $registration->submitted_at?->format('d M Y H:i'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function toDetailItem(MemberRegistration $registration): array
    {
        return [
            'id' => $registration->id,
            'full_name' => $registration->full_name,
            'nik' => $registration->nik,
            'nir' => $registration->nir,
            'email' => $registration->email,
            'phone' => $registration->phone,
            'photo' => $registration->photo,
            'gender' => $registration->gender,
            'gender_label' => $this->genderLabel($registration->gender),
            'blood_type' => $registration->blood_type,
            'religion' => $registration->religion,
            'religion_label' => $this->religionLabel($registration->religion),
            'birth_date' => $registration->birth_date?->format('d M Y'),
            'home_address' => $registration->home_address,
            'status' => $registration->status,
            'status_label' => $this->statusLabel($registration->status),
            'rejection_reason' => $registration->rejection_reason,
            'notes' => $registration->notes,
            'kabupaten_kota' => $registration->kabupatenKota?->name,
            'instansi' => $registration->instansi?->nama,
            'employment_status' => $registration->employment_status,
            'employment_status_label' => $this->employmentStatusLabel($registration->employment_status),
            'str_number' => $registration->str_number,
            'str_status' => $registration->str_status,
            'str_status_label' => $this->strStatusLabel($registration->str_status),
            'str_expiry_date' => $registration->str_expiry_date?->format('d M Y'),
            'education_institution' => $registration->education_institution,
            'education_college' => $registration->educationCollege?->name,
            'education_level' => $registration->education_level,
            'education_level_label' => $this->educationLevelLabel($registration->education_level),
            'diploma_number' => $registration->diploma_number,
            'graduation_year' => $registration->graduation_year,
            's2_program' => $registration->s2_program,
            's2_institution' => $registration->s2_institution,
            's3_program' => $registration->s3_program,
            's3_institution' => $registration->s3_institution,
            'diploma_file' => $registration->diploma_file,
            'field' => $registration->field,
            'field_label' => $this->fieldLabel($registration->field),
            'submitted_at' => $registration->submitted_at?->format('d M Y H:i'),
            'reviewed_at' => $registration->reviewed_at?->format('d M Y H:i'),
            'member_number' => $registration->member?->member_number,
            'logs' => $registration->logs
                ->sortByDesc('created_at')
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

    private function log(MemberRegistration $registration, string $status, string $note): void
    {
        MemberRegistrationLog::create([
            'registration_id' => $registration->id,
            'status' => $status,
            'note' => $note,
            'performed_by' => auth()->id(),
        ]);
    }

    private function backToDetail(MemberRegistration $registration): RedirectResponse
    {
        return redirect()->route('dashboard.verifikasi.show', $registration);
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

    private function genderLabel(?string $gender): ?string
    {
        return match ($gender) {
            'male' => 'Laki-laki',
            'female' => 'Perempuan',
            default => null,
        };
    }

    private function religionLabel(?string $religion): ?string
    {
        return match ($religion) {
            'islam' => 'Islam',
            'kristen_protestan' => 'Kristen Protestan',
            'katolik' => 'Katolik',
            'hindu' => 'Hindu',
            'buddha' => 'Buddha',
            'konghucu' => 'Konghucu',
            'lainnya' => 'Lainnya',
            default => null,
        };
    }

    private function employmentStatusLabel(?string $status): ?string
    {
        return match ($status) {
            'pns' => 'PNS',
            'bumn' => 'BUMN',
            'tni' => 'TNI',
            'polri' => 'POLRI',
            'swasta_non_pns' => 'Swasta / Non PNS',
            default => null,
        };
    }

    private function strStatusLabel(?string $status): ?string
    {
        return match ($status) {
            'sementara' => 'STR Sementara',
            'seumur_hidup' => 'STR Seumur Hidup',
            default => null,
        };
    }

    private function educationLevelLabel(?string $level): ?string
    {
        return match ($level) {
            'd3' => 'D3',
            'd4' => 'D4',
            default => null,
        };
    }

    private function fieldLabel(?string $field): ?string
    {
        return match ($field) {
            'radiodiagnostik' => 'Radiodiagnostik',
            'radioterapi' => 'Radioterapi',
            'intervensi_radiologi' => 'Intervensi Radiologi',
            'kedokteran_nuklir' => 'Kedokteran Nuklir',
            default => null,
        };
    }
}
