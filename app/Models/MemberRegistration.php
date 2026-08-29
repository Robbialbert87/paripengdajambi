<?php

namespace App\Models;

use Database\Factories\MemberRegistrationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $full_name
 * @property string|null $nik
 * @property string $nir
 * @property string $email
 * @property string $phone
 * @property string|null $gender
 * @property string|null $blood_type
 * @property string|null $religion
 * @property Carbon|null $birth_date
 * @property string|null $home_address
 * @property string|null $employment_status
 * @property string|null $str_number
 * @property string|null $str_status
 * @property Carbon|null $str_expiry_date
 * @property int|null $education_college_id
 * @property string|null $education_institution
 * @property string|null $education_level
 * @property string|null $diploma_number
 * @property int|null $graduation_year
 * @property string|null $s2_program
 * @property string|null $s2_institution
 * @property string|null $s3_program
 * @property string|null $s3_institution
 * @property string|null $diploma_file
 * @property string|null $field
 * @property string|null $photo
 * @property string $status
 * @property Carbon|null $submitted_at
 * @property Carbon|null $reviewed_at
 * @property string|null $rejection_reason
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class MemberRegistration extends Model
{
    /** @use HasFactory<MemberRegistrationFactory> */
    use HasFactory;

    public const STATUSES = [
        'draft',
        'submitted',
        'under_review',
        'revision',
        'approved',
        'rejected',
    ];

    public const GENDERS = ['male', 'female'];

    public const BLOOD_TYPES = ['A', 'B', 'AB', 'O'];

    public const RELIGIONS = ['islam', 'kristen_protestan', 'katolik', 'hindu', 'buddha', 'konghucu', 'lainnya'];

    public const EMPLOYMENT_STATUSES = ['pns', 'bumn', 'tni', 'polri', 'swasta_non_pns'];

    public const STR_STATUSES = ['sementara', 'seumur_hidup'];

    public const EDUCATION_LEVELS = ['d3', 'd4'];

    public const FIELDS = ['radiodiagnostik', 'radioterapi', 'intervensi_radiologi', 'kedokteran_nuklir'];

    protected $fillable = [
        'member_id',
        'full_name',
        'nik',
        'nir',
        'email',
        'phone',
        'gender',
        'blood_type',
        'religion',
        'birth_date',
        'home_address',
        'employment_status',
        'str_number',
        'str_status',
        'str_expiry_date',
        'education_college_id',
        'education_institution',
        'education_level',
        'diploma_number',
        'graduation_year',
        's2_program',
        's2_institution',
        's3_program',
        's3_institution',
        'diploma_file',
        'field',
        'photo',
        'instansi_id',
        'kabupaten_kota_id',
        'status',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
        'rejection_reason',
        'notes',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'birth_date' => 'datetime',
            'str_expiry_date' => 'datetime',
            'graduation_year' => 'integer',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Member, $this> */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /** @return BelongsTo<Instansi, $this> */
    public function instansi(): BelongsTo
    {
        return $this->belongsTo(Instansi::class);
    }

    /** @return BelongsTo<KabupatenKota, $this> */
    public function kabupatenKota(): BelongsTo
    {
        return $this->belongsTo(KabupatenKota::class);
    }

    /** @return BelongsTo<EducationCollege, $this> */
    public function educationCollege(): BelongsTo
    {
        return $this->belongsTo(EducationCollege::class);
    }

    /** @return BelongsTo<User, $this> */
    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /** @return HasMany<MemberRegistrationLog, $this> */
    public function logs(): HasMany
    {
        return $this->hasMany(MemberRegistrationLog::class, 'registration_id');
    }
}
