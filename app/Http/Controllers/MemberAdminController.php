<?php

namespace App\Http\Controllers;

use App\Models\Instansi;
use App\Models\KabupatenKota;
use App\Models\Member;
use App\Models\MemberRegistration;
use App\Models\Role;
use App\Support\MemberAccountActivator;
use App\Support\WebpConverter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class MemberAdminController extends Controller
{
    public function index(): Response
    {
        $members = Member::query()
            ->with([
                'user.role',
                'registrations' => fn ($query) => $query
                    ->where('status', 'approved')
                    ->with(['instansi.kabupatenKota', 'kabupatenKota'])
                    ->latest('id'),
            ])
            ->orderBy('full_name')
            ->get();

        return Inertia::render('dashboard/direktori-anggota', [
            'members' => $members->map(fn (Member $member) => $this->toItem($member)),
            'kabupatenKota' => KabupatenKota::orderBy('name')->get(['id', 'name']),
            'instansi' => Instansi::where('is_active', true)
                ->orderBy('nama')
                ->get(['id', 'nama', 'kabupaten_kota_id']),
        ]);
    }

    public function update(Request $request, Member $member): RedirectResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'nik' => ['nullable', 'digits:16', Rule::unique('members', 'nik')->ignore($member->id)],
            'nir' => ['required', 'string', 'max:255', Rule::unique('members', 'nir')->ignore($member->id)],
            'email' => ['required', 'string', 'max:255', 'lowercase', 'email', Rule::unique('members', 'email')->ignore($member->id)],
            'phone' => ['required', 'string', 'max:255'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,gif,webp', 'max:5120'],
            'membership_status' => ['required', Rule::in(Member::MEMBERSHIP_STATUSES)],
            'directory_visible' => ['boolean'],
            'instansi_id' => ['nullable', 'exists:instansi,id'],
            'kabupaten_kota_id' => ['nullable', 'exists:kabupaten_kota,id'],
        ]);

        $photo = $member->photo;

        if ($request->hasFile('photo')) {
            $photo = $this->storeFoto($request->file('photo'));

            if ($member->photo) {
                Storage::disk('public')->delete($member->photo);
            }
        }

        $member->update([
            'full_name' => $validated['full_name'],
            'nik' => $request->filled('nik') ? $validated['nik'] : $member->nik,
            'nir' => $validated['nir'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'photo' => $photo,
            'membership_status' => $validated['membership_status'],
            'directory_visible' => $validated['directory_visible'] ?? false,
        ]);

        $this->updateApprovedRegistration($member, $validated);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Data anggota berhasil diperbarui.',
        ]);
    }

    public function destroy(Member $member): RedirectResponse
    {
        if ($member->photo) {
            Storage::disk('public')->delete($member->photo);
        }

        $member->delete();

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Anggota berhasil dihapus.',
        ]);
    }

    public function storeRole(Request $request, Member $member): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['member', 'pengurus', 'admin'])],
        ]);

        $user = MemberAccountActivator::activate($member);

        if ($user->id === auth()->id() && $validated['role'] !== 'admin') {
            throw ValidationException::withMessages([
                'role' => 'Anda tidak dapat menurunkan hak akses akun sendiri.',
            ]);
        }

        $role = Role::where('slug', $validated['role'])->firstOrFail();

        $user->update([
            'role_id' => $role->id,
            'is_active' => true,
        ]);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Hak akses '.$member->full_name.' diubah menjadi '.$role->name.'.',
        ]);
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    private function updateApprovedRegistration(Member $member, array $validated): void
    {
        $registration = MemberRegistration::query()
            ->where('member_id', $member->id)
            ->where('status', 'approved')
            ->latest('id')
            ->first();

        if (! $registration) {
            return;
        }

        $registration->update([
            'instansi_id' => $validated['instansi_id'] ?? $registration->instansi_id,
            'kabupaten_kota_id' => $validated['kabupaten_kota_id'] ?? $registration->kabupaten_kota_id,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function toItem(Member $member): array
    {
        $registration = $member->registrations->first();

        return [
            'id' => $member->id,
            'member_number' => $member->member_number,
            'full_name' => $member->full_name,
            'nir' => $member->nir,
            'nik' => $member->nik,
            'email' => $member->email,
            'phone' => $member->phone,
            'photo' => $member->photo,
            'membership_status' => $member->membership_status,
            'directory_visible' => $member->directory_visible,
            'instansi_id' => $registration?->instansi_id,
            'kabupaten_kota_id' => $registration?->kabupaten_kota_id,
            'instansi' => $registration?->instansi?->nama,
            'kabupaten_kota' => $registration?->kabupatenKota?->name,
            'account' => $member->user ? [
                'email' => $member->user->email,
                'role_slug' => $member->user->role?->slug,
            ] : null,
        ];
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
}
