<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('instansi', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('jenis', 20);
            $table->string('alamat')->nullable();
            $table->string('telepon')->nullable();
            $table->foreignId('kabupaten_kota_id')
                ->nullable()
                ->constrained('kabupaten_kota')
                ->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instansi');
    }
};
