<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('member_registration_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')
                ->constrained('member_registrations')
                ->cascadeOnDelete();
            $table->string('status', 20);
            $table->string('note')->nullable();
            $table->foreignId('performed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_registration_logs');
    }
};
