<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organisasi_bidang', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('icon_key');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('organisasi_anggota', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('inisial');
            $table->string('kategori'); // pembina_penasihat | ketua_umum | ketua_bidang | anggota
            $table->foreignId('bidang_id')->nullable()->constrained('organisasi_bidang')->cascadeOnDelete();
            $table->string('foto')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('organisasi_kontak', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('telepon');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organisasi_kontak');
        Schema::dropIfExists('organisasi_anggota');
        Schema::dropIfExists('organisasi_bidang');
    }
};
