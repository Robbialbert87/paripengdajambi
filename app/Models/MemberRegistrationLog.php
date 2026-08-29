<?php

namespace App\Models;

use Database\Factories\MemberRegistrationLogFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberRegistrationLog extends Model
{
    /** @use HasFactory<MemberRegistrationLogFactory> */
    use HasFactory;

    protected $fillable = [
        'registration_id',
        'status',
        'note',
        'performed_by',
    ];

    /** @return BelongsTo<MemberRegistration, $this> */
    public function registration(): BelongsTo
    {
        return $this->belongsTo(MemberRegistration::class, 'registration_id');
    }

    /** @return BelongsTo<User, $this> */
    public function performedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
