<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * The admin Users screen (design 10:62689) shows an account status of
     * Active or Suspended, and its summary cards count both. `suspended_at`
     * records when the suspension happened so the restore action can be
     * audited later.
     */
    public function up(): void
    {
        if (Schema::hasColumn('users', 'status')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->string('status', 20)->default('active')->index();
            $table->timestamp('suspended_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['status', 'suspended_at']);
        });
    }
};
