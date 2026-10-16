<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * The base `create_users_table` migration already defines `role`, so this
     * is a no-op on a fresh database and only backfills older installations.
     */
    public function up(): void
    {
        if (Schema::hasColumn('users', 'role')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 20)->default('student')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // `role` is owned by the base users migration; leave it in place.
    }
};
