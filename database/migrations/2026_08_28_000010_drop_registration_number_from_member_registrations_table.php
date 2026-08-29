<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('member_registrations', function (Blueprint $table) {
            $table->dropUnique('member_registrations_registration_number_unique');
            $table->dropColumn('registration_number');
        });
    }

    public function down(): void
    {
        Schema::table('member_registrations', function (Blueprint $table) {
            $table->string('registration_number');
            $table->unique('registration_number');
        });
    }
};
