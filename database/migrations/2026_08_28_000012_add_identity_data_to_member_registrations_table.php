<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('member_registrations', function (Blueprint $table) {
            $table->string('nik')->nullable()->index();
            $table->string('gender', 20)->nullable();
            $table->string('blood_type', 5)->nullable();
            $table->string('religion', 40)->nullable();
            $table->date('birth_date')->nullable();
            $table->text('home_address')->nullable();
            $table->string('employment_status', 30)->nullable();
            $table->string('str_number')->nullable();
            $table->string('str_status', 20)->nullable();
            $table->date('str_expiry_date')->nullable();
            $table->foreignId('education_college_id')
                ->nullable()
                ->constrained('education_colleges')
                ->nullOnDelete();
            $table->string('education_institution')->nullable();
            $table->string('education_level', 10)->nullable();
            $table->string('diploma_number')->nullable();
            $table->unsignedSmallInteger('graduation_year')->nullable();
            $table->string('s2_program')->nullable();
            $table->string('s2_institution')->nullable();
            $table->string('s3_program')->nullable();
            $table->string('s3_institution')->nullable();
            $table->string('diploma_file')->nullable();
            $table->string('field', 40)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('member_registrations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('education_college_id');
            $table->dropColumn([
                'nik',
                'gender',
                'blood_type',
                'religion',
                'birth_date',
                'home_address',
                'employment_status',
                'str_number',
                'str_status',
                'str_expiry_date',
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
            ]);
        });
    }
};
