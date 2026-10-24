<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            // Data File (Upload awal)
            $table->string('file_path', 500); 
            $table->string('file_type', 50);  
            $table->string('status', 20)->default('pending'); // pending, processed, failed
            
            // Data Hasil AI (Awalnya di tabel courses, sekarang digabung ke sini)
            $table->string('title')->nullable();
            $table->text('summary')->nullable();
            $table->string('difficulty', 50)->nullable(); // beginner, intermediate, advanced
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};