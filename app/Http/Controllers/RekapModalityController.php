<?php

namespace App\Http\Controllers;

use App\Models\Instansi;
use App\Models\MemberRegistration;
use Inertia\Inertia;
use Inertia\Response;

class RekapModalityController extends Controller
{
    public const MODALITY_LABELS = [
        'cr' => 'CR (Computed Radiography)',
        'dr' => 'DR (Digital Radiography)',
        'ct_scan' => 'CT Scan',
        'mri' => 'MRI',
        'usg' => 'Ultrasonography (USG)',
        'mamografi' => 'Mamograf',
        'fluoroskopi' => 'Fluoroskopi',
        'kedokteran_nuklir' => 'Kedokteran Nuklir',
    ];

    public function index(): Response
    {
        $registrations = MemberRegistration::query()
            ->with(['instansi.kabupatenKota'])
            ->where('status', 'approved')
            ->whereNotNull('modalities')
            ->get()
            ->groupBy(fn (MemberRegistration $registration) => $registration->instansi_id ?? 'tanpa-instansi');

        $instansi = [];

        foreach ($registrations as $regs) {
            /** @var MemberRegistration $first */
            $first = $regs->first();
            $instansiModel = $first->instansi;

            $modalities = $regs
                ->flatMap(fn (MemberRegistration $registration) => (array) $registration->modalities)
                ->unique()
                ->sort()
                ->values();

            if ($modalities->isEmpty()) {
                continue;
            }

            $labels = $modalities->map(fn (string $modality) => self::MODALITY_LABELS[$modality]);

            $nama = $instansiModel instanceof Instansi ? $instansiModel->nama : 'Tanpa Instansi';
            $wilayah = $instansiModel?->kabupatenKota?->name;

            $instansi[] = [
                'id' => $instansiModel?->id,
                'nama' => $nama,
                'wilayah' => $wilayah ?? 'Tanpa wilayah',
                'modalities' => $modalities->all(),
                'modality_labels' => $labels->all(),
                'modality_search' => $labels->implode(' '),
                'jumlah_modalities' => $modalities->count(),
            ];
        }

        usort($instansi, fn (array $a, array $b) => strcmp($a['nama'], $b['nama']));

        $wilayahOptions = collect($instansi)
            ->pluck('wilayah')
            ->filter(fn (string $wilayah) => $wilayah !== 'Tanpa wilayah')
            ->unique()
            ->sort()
            ->values()
            ->all();

        $modalityOptions = collect(MemberRegistration::MODALITIES)
            ->map(fn (string $modality) => [
                'value' => $modality,
                'label' => self::MODALITY_LABELS[$modality],
            ])
            ->all();

        return Inertia::render('dashboard/master/modality-rekap', [
            'instansi' => $instansi,
            'modalityOptions' => $modalityOptions,
            'wilayahOptions' => $wilayahOptions,
        ]);
    }
}
