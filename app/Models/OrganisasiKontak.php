<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrganisasiKontak extends Model
{
    protected $table = 'organisasi_kontak';

    protected $fillable = [
        'nama',
        'telepon',
        'sort_order',
    ];
}
