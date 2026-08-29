<?php

namespace App\Models;

use Database\Factories\RoleFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property array<int, string> $permissions
 */
class Role extends Model
{
    /** @use HasFactory<RoleFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'permissions',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'permissions' => 'array',
        ];
    }

    public function can(string $permission): bool
    {
        if ($this->slug === 'admin') {
            return true;
        }

        return in_array($permission, $this->permissions ?? [], true);
    }

    /** @return HasMany<User, $this> */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
