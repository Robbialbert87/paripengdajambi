<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('member_registrations', function (Blueprint $table) {
            $table->string('full_name')->nullable();
            $table->string('photo')->nullable();
            $table->foreignId('instansi_id')
                ->nullable()
                ->constrained('instansi')
                ->nullOnDelete();
            $table->foreignId('kabupaten_kota_id')
                ->nullable()
                ->constrained('kabupaten_kota')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('member_registrations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('instansi_id');
            $table->dropConstrainedForeignId('kabupaten_kota_id');
            $table->dropColumn(['full_name', 'photo']);
        });
    }
};
