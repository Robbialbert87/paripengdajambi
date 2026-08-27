<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class OrganisasiAnggota extends Model
{
    protected $table = 'organisasi_anggota';

    public const KATEGORI = [
        'pembina_penasihat',
        'ketua_umum',
        'ketua_bidang',
        'anggota',
    ];

    protected $fillable = [
        'nama',
        'inisial',
        'kategori',
        'bidang_id',
        'foto',
        'sort_order',
    ];

    protected $appends = ['foto_url'];

    /** @return BelongsTo<OrganisasiBidang, $this> */
    public function bidang(): BelongsTo
    {
        return $this->belongsTo(OrganisasiBidang::class, 'bidang_id');
    }

    public function getFotoUrlAttribute(): ?string
    {
        return $this->foto ? Storage::disk('public')->url($this->foto) : null;
    }
}
