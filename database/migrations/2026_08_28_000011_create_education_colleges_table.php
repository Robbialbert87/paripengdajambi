<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('education_colleges', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('type', 10)->default('swasta');
            $table->string('kind', 30)->default('sekolah_tinggi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('education_colleges');
    }
};
