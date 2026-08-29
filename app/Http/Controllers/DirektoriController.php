<?php

namespace App\Http\Controllers;

use App\Models\KabupatenKota;
use App\Models\Member;
use Inertia\Inertia;
use Inertia\Response;

class DirektoriController extends Controller
{
    public function index(): Response
    {
        $members = Member::query()
            ->where('membership_status', 'active')
            ->where('directory_visible', true)
            ->with(['registrations.instansi.kabupatenKota'])
            ->orderBy('full_name')
            ->get();

        return Inertia::render('keanggotaan/direktori', [
            'members' => $members->map(
                fn (Member $member) => $this->toItem($member),
            ),
            'kabupatenKota' => KabupatenKota::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function toItem(Member $member): array
    {
        $registration = $member->registrations
            ->where('status', 'approved')
            ->sortByDesc('id')
            ->first();

        return [
            'member_number' => $member->member_number,
            'full_name' => $member->full_name,
            'photo' => $member->photo,
            'kabupaten_kota_id' => $registration?->kabupaten_kota_id,
            'kabupaten_kota' => $registration?->kabupatenKota?->name,
            'instansi' => $registration?->instansi?->nama,
        ];
    }
}
