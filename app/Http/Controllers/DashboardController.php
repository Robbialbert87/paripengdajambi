<?php

namespace App\Http\Controllers;

use App\Models\Instansi;
use App\Models\Member;
use App\Models\MemberRegistration;
use App\Models\User;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public const PENDING_STATUSES = ['submitted', 'under_review'];

    public function index(): Response
    {
        $user = auth()->user();

        if ($user?->role?->slug === 'member') {
            return Inertia::render('dashboard');
        }

        $breakdown = $this->verificationBreakdown();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalAnggota' => Member::count(),
                'pendingVerifikasi' => $breakdown->sum('count'),
                'totalInstansi' => Instansi::where('is_active', true)->count(),
                'totalPengguna' => User::count(),
            ],
            'verificationBreakdown' => $breakdown->values(),
            'recentRegistrations' => $this->recentRegistrations(),
        ]);
    }

    /**
     * @return Collection<int, array{status: string, label: string, count: int<1, max>, percentage: int}>
     */
    private function verificationBreakdown(): Collection
    {
        $counts = MemberRegistration::query()
            ->selectRaw('status, COUNT(*) as total')
            ->whereIn('status', MemberRegistration::STATUSES)
            ->groupBy('status')
            ->pluck('total', 'status');

        $grand = max(1, $counts->sum());

        $labels = [
            'draft' => 'Draf',
            'submitted' => 'Diajukan',
            'under_review' => 'Dalam Review',
            'revision' => 'Revisi Diperlukan',
            'approved' => 'Disetujui',
            'rejected' => 'Ditolak',
        ];

        return collect(MemberRegistration::STATUSES)
            ->map(function (string $status) use ($counts, $grand, $labels) {
                $count = (int) ($counts[$status] ?? 0);

                return [
                    'status' => $status,
                    'label' => $labels[$status] ?? ucfirst($status),
                    'count' => $count,
                    'percentage' => (int) round($count / $grand * 100),
                ];
            })
            ->filter(fn (array $item) => $item['count'] > 0)
            ->sortByDesc('count');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function recentRegistrations(): array
    {
        return MemberRegistration::with(['instansi', 'kabupatenKota'])
            ->whereIn('status', MemberRegistration::STATUSES)
            ->latest('submitted_at')
            ->limit(5)
            ->get()
            ->map(fn (MemberRegistration $registration) => [
                'id' => $registration->id,
                'full_name' => $registration->full_name,
                'nir' => $registration->nir,
                'instansi' => $registration->instansi?->nama,
                'kabupaten_kota' => $registration->kabupatenKota?->name,
                'status' => $registration->status,
                'submitted_at' => $registration->submitted_at?->format('d M Y'),
            ])
            ->all();
    }
}
