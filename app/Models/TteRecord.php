<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TteRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_lengkap',
        'nomor_anggota',
        'jabatan',
        'tahun_mulai',
        'tahun_selesai',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'tahun_mulai' => 'integer',
        'tahun_selesai' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeLatest($query)
    {
        return $query->orderByDesc('tahun_mulai');
    }

    public function isActiveAndValid(): bool
    {
        $currentYear = (int) date('Y');
        return $this->is_active && $currentYear >= $this->tahun_mulai && $currentYear <= $this->tahun_selesai;
    }

    public function isExpired(): bool
    {
        return (int) date('Y') > $this->tahun_selesai;
    }

    public function statusLabel(): string
    {
        if ($this->isActiveAndValid()) {
            return 'active';
        }
        if ($this->isExpired()) {
            return 'expired';
        }
        return 'inactive';
    }
}
