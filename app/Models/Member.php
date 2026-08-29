<?php

namespace App\Models;

use Database\Factories\MemberFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $member_number
 * @property int|null $user_id
 * @property string $nir
 * @property string|null $nik
 * @property string $full_name
 * @property string $email
 * @property string $phone
 * @property string|null $photo
 * @property string $membership_status
 * @property bool $directory_visible
 * @property Carbon|null $verified_at
 * @property int|null $verified_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Member extends Model
{
    /** @use HasFactory<MemberFactory> */
    use HasFactory;

    public const MEMBERSHIP_STATUSES = [
        'active',
        'inactive',
        'suspended',
    ];

    public const MEMBER_NUMBER_PREFIX = 'PARI-JBI-';

    protected $fillable = [
        'member_number',
        'user_id',
        'nir',
        'nik',
        'full_name',
        'email',
        'phone',
        'photo',
        'membership_status',
        'directory_visible',
        'verified_at',
        'verified_by',
    ];

    /**
     * Boot model events to auto-generate the member number.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Member $member) {
            if (empty($member->member_number)) {
                $sequence = (int) static::max('id') + 1;
                $member->member_number = sprintf(
                    static::MEMBER_NUMBER_PREFIX.'%04d',
                    $sequence,
                );
            }
        });
    }

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'directory_visible' => 'boolean',
            'verified_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<User, $this> */
    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /** @return HasMany<MemberRegistration, $this> */
    public function registrations(): HasMany
    {
        return $this->hasMany(MemberRegistration::class);
    }

    /** @return HasOne<MemberRegistration, $this> */
    public function latestRegistration(): HasOne
    {
        return $this->hasOne(MemberRegistration::class)->latestOfMany();
    }
}
