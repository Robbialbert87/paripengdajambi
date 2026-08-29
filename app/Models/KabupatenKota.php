<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KabupatenKota extends Model
{
    protected $table = 'kabupaten_kota';

    protected $fillable = [
        'name',
    ];

    /** @return HasMany<Instansi, $this> */
    public function instansis(): HasMany
    {
        return $this->hasMany(Instansi::class);
    }

    /** @return HasMany<MemberRegistration, $this> */
    public function registrations(): HasMany
    {
        return $this->hasMany(MemberRegistration::class);
    }
}
