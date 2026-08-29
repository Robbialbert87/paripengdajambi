<?php

namespace App\Http\Controllers;

use App\Models\OrganisasiAnggota;
use App\Models\OrganisasiBidang;
use App\Models\OrganisasiKontak;
use App\Support\WebpConverter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class StrukturOrganisasiController extends Controller
{
    public const ICONS = [
        'clipboard-list',
        'scale',
        'graduation-cap',
        'monitor',
        'wallet',
        'book-open',
        'users',
    ];

    public function index(): Response
    {
        $bidangs = OrganisasiBidang::with(['anggota' => fn ($q) => $q->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('dashboard/struktur-organisasi', [
            'pembinas' => $this->personList('pembina_penasihat'),
            'chairman' => $this->chairmanArray(),
            'bidangs' => $bidangs->map(function ($b) {
                $ketua = $b->ketuaBidang();

                return [
                    'id' => $b->id,
                    'nama' => $b->nama,
                    'icon_key' => $b->icon_key,
                    'sort_order' => $b->sort_order,
                    'ketua' => $ketua ? $this->personArray($ketua) : null,
                    'anggota' => $b->anggota
                        ->where('kategori', 'anggota')
                        ->values()
                        ->map(fn ($a) => $this->personArray($a)),
                ];
            }),
            'kontaks' => OrganisasiKontak::orderBy('sort_order')->get()->map(fn ($k) => [
                'id' => $k->id,
                'nama' => $k->nama,
                'telepon' => $k->telepon,
                'sort_order' => $k->sort_order,
            ]),
            'icons' => self::ICONS,
        ]);
    }

    public function show(): Response
    {
        $advisors = OrganisasiAnggota::where('kategori', 'pembina_penasihat')
            ->orderBy('sort_order')
            ->get();

        $bidangs = OrganisasiBidang::with(['anggota' => fn ($q) => $q->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('profil/struktur-organisasi', [
            'advisors' => $advisors->map(fn ($a) => $this->publicPerson($a)),
            'chairman' => $this->chairman() ? $this->publicPerson($this->chairman()) : null,
            'departments' => $bidangs->map(function ($b) {
                $ketua = $b->ketuaBidang();

                return [
                    'name' => $b->nama,
                    'icon_key' => $b->icon_key,
                    'chairman' => $ketua ? $this->publicPerson($ketua) : null,
                    'members' => $b->anggota
                        ->where('kategori', 'anggota')
                        ->values()
                        ->map(fn ($a) => $this->publicPerson($a)),
                ];
            }),
            'contacts' => OrganisasiKontak::orderBy('sort_order')->get()->map(fn ($k) => [
                'name' => $k->nama,
                'phone' => $k->telepon,
            ]),
        ]);
    }

    /* ── Bidang ─────────────────────────────────────────────────────────────── */

    public function storeBidang(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'icon_key' => 'required|in:'.implode(',', self::ICONS),
            'sort_order' => 'nullable|integer|min:0',
        ]);

        OrganisasiBidang::create([
            ...$validated,
            'sort_order' => $validated['sort_order'] ?? (OrganisasiBidang::max('sort_order') + 1),
        ]);

        return redirect()->back()->with('success', 'Bidang berhasil ditambahkan.');
    }

    public function updateBidang(Request $request, OrganisasiBidang $bidang): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'icon_key' => 'required|in:'.implode(',', self::ICONS),
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $bidang->update($validated);

        return redirect()->back()->with('success', 'Bidang berhasil diperbarui.');
    }

    public function destroyBidang(OrganisasiBidang $bidang): RedirectResponse
    {
        foreach ($bidang->anggota as $anggota) {
            $this->deleteFoto($anggota);
        }

        $bidang->delete();

        return redirect()->back()->with('success', 'Bidang berhasil dihapus.');
    }

    /* ── Anggota ────────────────────────────────────────────────────────────── */

    public function storeAnggota(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'inisial' => 'required|string|max:10',
            'kategori' => 'required|in:'.implode(',', OrganisasiAnggota::KATEGORI),
            'bidang_id' => [
                'nullable',
                Rule::requiredIf(in_array($request->kategori, ['ketua_bidang', 'anggota'])),
                'exists:organisasi_bidang,id',
            ],
            'foto' => 'nullable|image|mimes:jpeg,png,gif,webp|max:5120',
        ]);

        $foto = null;
        if ($request->hasFile('foto')) {
            $foto = $this->storeFoto($request->file('foto'));
        }

        $this->demoteExistingKetuaUmum($validated['kategori'] ?? '');

        $sortOrder = $this->nextSortOrder($validated['kategori'] ?? '', $validated['bidang_id'] ?? null);

        OrganisasiAnggota::create([
            'nama' => $validated['nama'],
            'inisial' => $validated['inisial'],
            'kategori' => $validated['kategori'],
            'bidang_id' => $validated['bidang_id'],
            'foto' => $foto,
            'sort_order' => $sortOrder,
        ]);

        return redirect()->back()->with('success', 'Anggota berhasil ditambahkan.');
    }

    public function updateAnggota(Request $request, OrganisasiAnggota $anggota): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'inisial' => 'required|string|max:10',
            'kategori' => 'required|in:'.implode(',', OrganisasiAnggota::KATEGORI),
            'bidang_id' => [
                'nullable',
                Rule::requiredIf(in_array($request->kategori, ['ketua_bidang', 'anggota'])),
                'exists:organisasi_bidang,id',
            ],
            'foto' => 'nullable|image|mimes:jpeg,png,gif,webp|max:5120',
            'hapus_foto' => 'nullable',
        ]);

        $data = [
            'nama' => $validated['nama'],
            'inisial' => $validated['inisial'],
            'kategori' => $validated['kategori'],
            'bidang_id' => $validated['bidang_id'],
        ];

        if ($request->boolean('hapus_foto')) {
            $this->deleteFoto($anggota);
            $data['foto'] = null;
        } elseif ($request->hasFile('foto')) {
            $this->deleteFoto($anggota);
            $data['foto'] = $this->storeFoto($request->file('foto'));
        }

        $this->demoteExistingKetuaUmum($validated['kategori'], $anggota->id);

        $anggota->update($data);

        return redirect()->back()->with('success', 'Anggota berhasil diperbarui.');
    }

    public function destroyAnggota(OrganisasiAnggota $anggota): RedirectResponse
    {
        $this->deleteFoto($anggota);
        $anggota->delete();

        return redirect()->back()->with('success', 'Anggota berhasil dihapus.');
    }

    /* ── Kontak ─────────────────────────────────────────────────────────────── */

    public function storeKontak(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'telepon' => 'required|string|max:255',
        ]);

        OrganisasiKontak::create([
            ...$validated,
            'sort_order' => OrganisasiKontak::max('sort_order') + 1,
        ]);

        return redirect()->back()->with('success', 'Kontak berhasil ditambahkan.');
    }

    public function updateKontak(Request $request, OrganisasiKontak $kontak): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'telepon' => 'required|string|max:255',
        ]);

        $kontak->update($validated);

        return redirect()->back()->with('success', 'Kontak berhasil diperbarui.');
    }

    public function destroyKontak(OrganisasiKontak $kontak): RedirectResponse
    {
        $kontak->delete();

        return redirect()->back()->with('success', 'Kontak berhasil dihapus.');
    }

    /* ── Helpers ────────────────────────────────────────────────────────────── */

    private function chairman(): ?OrganisasiAnggota
    {
        return OrganisasiAnggota::where('kategori', 'ketua_umum')->first();
    }

    /** @return array<string, mixed>|null */
    private function chairmanArray(): ?array
    {
        return $this->chairman() ? $this->personArray($this->chairman()) : null;
    }

    /** @return Collection<int, array<string, mixed>> */
    private function personList(string $kategori): Collection
    {
        return OrganisasiAnggota::where('kategori', $kategori)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($a) => $this->personArray($a));
    }

    /** @return array<string, mixed> */
    private function personArray(OrganisasiAnggota $a): array
    {
        return [
            'id' => $a->id,
            'nama' => $a->nama,
            'inisial' => $a->inisial,
            'kategori' => $a->kategori,
            'bidang_id' => $a->bidang_id,
            'foto' => $a->foto,
            'foto_url' => $a->foto_url,
            'sort_order' => $a->sort_order,
        ];
    }

    /** @return array<string, mixed> */
    private function publicPerson(OrganisasiAnggota $a): array
    {
        return [
            'name' => $a->nama,
            'initials' => $a->inisial,
            'foto' => $a->foto_url,
        ];
    }

    private function storeFoto(UploadedFile $file): string
    {
        $data = $file->get();

        if ($data === false) {
            abort(422, 'Gambar tidak dapat dibaca.');
        }

        try {
            return WebpConverter::convert($data);
        } catch (Throwable $e) {
            abort(422, 'Gambar tidak dapat diproses menjadi WebP.');
        }
    }

    private function deleteFoto(OrganisasiAnggota $anggota): void
    {
        if ($anggota->foto) {
            Storage::disk('public')->delete($anggota->foto);
        }
    }

    private function demoteExistingKetuaUmum(string $kategori, ?int $exceptId = null): void
    {
        if ($kategori !== 'ketua_umum') {
            return;
        }

        OrganisasiAnggota::query()
            ->where('kategori', 'ketua_umum')
            ->when($exceptId, fn ($q) => $q->whereKeyNot($exceptId))
            ->get()
            ->each(function (OrganisasiAnggota $old) {
                $old->update([
                    'kategori' => 'pembina_penasihat',
                    'bidang_id' => null,
                    'sort_order' => $old->sort_order,
                ]);
            });
    }

    private function nextSortOrder(string $kategori, ?int $bidangId): int
    {
        $query = OrganisasiAnggota::where('kategori', $kategori);

        if (in_array($kategori, ['ketua_bidang', 'anggota'])) {
            $query->where('bidang_id', $bidangId);
        }

        return $query->count() + 1;
    }
}
