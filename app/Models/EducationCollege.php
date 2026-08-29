<?php

namespace App\Models;

use Database\Factories\EducationCollegeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $type
 * @property string $kind
 */
class EducationCollege extends Model
{
    /** @use HasFactory<EducationCollegeFactory> */
    use HasFactory;

    public const TYPES = ['negeri', 'swasta'];

    public const KINDS = ['universitas', 'institut', 'politeknik', 'sekolah_tinggi', 'akademi'];

    protected $fillable = ['name', 'type', 'kind'];
}
