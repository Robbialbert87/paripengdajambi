<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrganisasiBidang extends Model
{
    protected $table = 'organisasi_bidang';

    protected $fillable = [
        'nama',
        'icon_key',
        'sort_order',
    ];

    /** @return HasMany<OrganisasiAnggota, $this> */
    public function anggota(): HasMany
    {
        return $this->hasMany(OrganisasiAnggota::class, 'bidang_id');
    }

    public function ketuaBidang(): ?OrganisasiAnggota
    {
        return $this->anggota()->where('kategori', 'ketua_bidang')->first();
    }
}
