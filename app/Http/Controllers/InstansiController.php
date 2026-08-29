<?php

namespace App\Http\Controllers;

use App\Models\Instansi;
use App\Models\KabupatenKota;
use App\Support\CsvHelper;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InstansiController extends Controller
{
    public const JENIS = ['rumah_sakit', 'puskesmas', 'klinik', 'lainnya'];

    public const IMPORT_ALIASES = [
        'nama' => ['nama', 'nama instansi', 'instansi'],
        'jenis' => ['jenis', 'type', 'tipe'],
        'alamat' => ['alamat', 'address'],
        'telepon' => ['telepon', 'no telepon', 'phone'],
        'kabupaten_kota' => ['kabupaten_kota', 'kabupaten/kota', 'wilayah'],
        'is_active' => ['is_active', 'aktif', 'status'],
    ];

    public function index(): Response
    {
        return Inertia::render('dashboard/master/instansi', [
            'instansi' => Instansi::with('kabupatenKota')
                ->orderBy('nama')
                ->get()
                ->map(fn (Instansi $instansi) => [
                    'id' => $instansi->id,
                    'nama' => $instansi->nama,
                    'jenis' => $instansi->jenis,
                    'jenis_label' => $this->jenisLabel($instansi->jenis),
                    'alamat' => $instansi->alamat,
                    'telepon' => $instansi->telepon,
                    'kabupaten_kota_id' => $instansi->kabupaten_kota_id,
                    'kabupaten_kota' => $instansi->kabupatenKota?->name,
                    'is_active' => $instansi->is_active,
                ]),
            'kabupatenKota' => KabupatenKota::orderBy('name')->get(['id', 'name']),
            'jenisOptions' => collect(self::JENIS)->map(fn (string $jenis) => [
                'value' => $jenis,
                'label' => $this->jenisLabel($jenis),
            ])->values(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'jenis' => ['required', Rule::in(self::JENIS)],
            'alamat' => ['nullable', 'string', 'max:500'],
            'telepon' => ['nullable', 'string', 'max:50'],
            'kabupaten_kota_id' => ['nullable', 'exists:kabupaten_kota,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        Instansi::create([
            ...$validated,
            'is_active' => $request->boolean('is_active'),
        ]);

        return back()->with('toast', ['type' => 'success', 'message' => 'Instansi berhasil ditambahkan.']);
    }

    public function update(Request $request, Instansi $instansi): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'jenis' => ['required', Rule::in(self::JENIS)],
            'alamat' => ['nullable', 'string', 'max:500'],
            'telepon' => ['nullable', 'string', 'max:50'],
            'kabupaten_kota_id' => ['nullable', 'exists:kabupaten_kota,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $instansi->update([
            ...$validated,
            'is_active' => $request->boolean('is_active'),
        ]);

        return back()->with('toast', ['type' => 'success', 'message' => 'Instansi berhasil diperbarui.']);
    }

    public function destroy(Instansi $instansi): RedirectResponse
    {
        if ($instansi->registrations()->exists()) {
            return back()->with('toast', ['type' => 'error', 'message' => 'Instansi yang sudah dipakai registrasi tidak dapat dihapus.']);
        }

        $instansi->delete();

        return back()->with('toast', ['type' => 'success', 'message' => 'Instansi berhasil dihapus.']);
    }

    public function downloadTemplate(): StreamedResponse
    {
        return CsvHelper::download('template-instansi.csv', ['nama', 'jenis', 'alamat', 'telepon', 'kabupaten_kota', 'is_active'], [
            ['RSUD Contoh Jambi', 'rumah_sakit', 'Jl. Contoh No. 1', '0812 3456 789', 'Kota Jambi', '1'],
        ]);
    }

    public function import(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'file' => ['required', 'file', 'mimetypes:text/plain,text/csv,application/csv,application/vnd.ms-excel', 'max:5120'],
        ]);

        if ($validator->fails()) {
            return back()->with('toast', ['type' => 'error', 'message' => 'Unggah file CSV terlebih dahulu.']);
        }

        /** @var UploadedFile $file */
        $file = $request->file('file');

        try {
            $rows = CsvHelper::read($file, self::IMPORT_ALIASES);
        } catch (InvalidArgumentException $e) {
            return back()->with('toast', ['type' => 'error', 'message' => $e->getMessage()]);
        }

        $created = 0;
        $updated = 0;
        $wilayahBaru = 0;
        $errors = [];

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2;
            $nama = trim($row['nama'] ?? '');
            $jenis = $this->normalizeJenis(trim($row['jenis'] ?? ''));
            $alamat = trim($row['alamat'] ?? '');
            $telepon = trim($row['telepon'] ?? '');
            $kabupatenName = trim($row['kabupaten_kota'] ?? '');
            $isActive = $this->normalizeActive(trim($row['is_active'] ?? ''));

            if ($nama === '') {
                $errors[] = "Baris {$rowNumber}: nama kosong";

                continue;
            }

            if (strlen($nama) > 255) {
                $errors[] = "Baris {$rowNumber}: nama terlalu panjang";

                continue;
            }

            if ($jenis === null) {
                $errors[] = "Baris {$rowNumber}: jenis tidak valid";

                continue;
            }

            if (strlen($alamat) > 500) {
                $errors[] = "Baris {$rowNumber}: alamat terlalu panjang";

                continue;
            }

            if (strlen($telepon) > 50) {
                $errors[] = "Baris {$rowNumber}: telepon terlalu panjang";

                continue;
            }

            if (strlen($kabupatenName) > 255) {
                $errors[] = "Baris {$rowNumber}: nama wilayah terlalu panjang";

                continue;
            }

            $kabupatenKotaId = null;

            if ($kabupatenName !== '') {
                $kabupatenKota = KabupatenKota::whereRaw('LOWER(name) = ?', [mb_strtolower($kabupatenName)])->first();

                if (! $kabupatenKota) {
                    $kabupatenKota = KabupatenKota::create(['name' => $kabupatenName]);
                    $wilayahBaru++;
                }

                $kabupatenKotaId = $kabupatenKota->id;
            }

            $data = [
                'nama' => $nama,
                'jenis' => $jenis,
                'alamat' => $alamat === '' ? null : $alamat,
                'telepon' => $telepon === '' ? null : $telepon,
                'kabupaten_kota_id' => $kabupatenKotaId,
                'is_active' => $isActive,
            ];

            $existing = Instansi::where('nama', $nama)
                ->where('kabupaten_kota_id', $kabupatenKotaId)
                ->first();

            if ($existing) {
                $existing->update($data);
                $updated++;
            } else {
                Instansi::create($data);
                $created++;
            }
        }

        $message = "Import selesai: {$created} ditambahkan, {$updated} diperbarui.";

        if ($wilayahBaru > 0) {
            $message .= " {$wilayahBaru} wilayah baru.";
        }

        if ($errors !== []) {
            $message .= ' '.count($errors).' gagal: '.implode(' | ', array_slice($errors, 0, 5));
        }

        $type = $errors === [] ? 'success' : 'warning';

        return back()->with('toast', ['type' => $type, 'message' => $message]);
    }

    private function normalizeJenis(string $value): ?string
    {
        return match (mb_strtolower($value)) {
            'rumah_sakit', 'rumah sakit', 'rs' => 'rumah_sakit',
            'puskesmas' => 'puskesmas',
            'klinik' => 'klinik',
            'lainnya', 'lain-lain', 'lain' => 'lainnya',
            default => null,
        };
    }

    private function normalizeActive(string $value): bool
    {
        return ! in_array(mb_strtolower($value), ['0', 'n', 'no', 'false', 'tidak', 'nonaktif'], true);
    }

    private function jenisLabel(string $jenis): string
    {
        return match ($jenis) {
            'rumah_sakit' => 'Rumah Sakit',
            'puskesmas' => 'Puskesmas',
            'klinik' => 'Klinik',
            default => 'Lainnya',
        };
    }
}
