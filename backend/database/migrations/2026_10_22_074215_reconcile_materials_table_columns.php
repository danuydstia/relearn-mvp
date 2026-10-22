<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Reconcile the materials table with the Supabase upload contract.
     *
     * The table was originally created with uploaded-name/mime columns, then the
     * upload code moved to title + file_path + file_type. The migration file was
     * edited in place, so environments differ: some still have the old columns,
     * others were rebuilt with the new ones. Every step is therefore guarded.
     */
    public function up(): void
    {
        foreach ([
            'title' => fn (Blueprint $table) => $table->string('title')->default(''),
            'file_path' => fn (Blueprint $table) => $table->string('file_path', 500)->default(''),
            'file_type' => fn (Blueprint $table) => $table->string('file_type', 50)->default(''),
        ] as $column => $definition) {
            if (! Schema::hasColumn('materials', $column)) {
                Schema::table('materials', $definition);
            }
        }

        $legacyColumns = array_values(array_filter(
            ['original_name', 'stored_name', 'mime_type', 'size', 'disk', 'path', 'failure_reason'],
            fn (string $column): bool => Schema::hasColumn('materials', $column),
        ));

        if ($legacyColumns === []) {
            return;
        }

        DB::table('materials')
            ->select(array_merge(['id', 'title', 'file_path', 'file_type'], $legacyColumns))
            ->orderBy('id')
            ->chunkById(100, function ($rows): void {
                foreach ($rows as $row) {
                    $sourceName = (string) ($row->original_name ?? $row->stored_name ?? $row->path ?? '');
                    $updates = [];

                    if (($row->title ?? '') === '') {
                        $updates['title'] = pathinfo($sourceName, PATHINFO_FILENAME) ?: 'Untitled material';
                    }

                    if (($row->file_path ?? '') === '' && ! empty($row->path)) {
                        $updates['file_path'] = $row->path;
                    }

                    if (($row->file_type ?? '') === '') {
                        $updates['file_type'] = strtolower(pathinfo($sourceName, PATHINFO_EXTENSION)) ?: 'pdf';
                    }

                    if ($updates !== []) {
                        DB::table('materials')->where('id', $row->id)->update($updates);
                    }
                }
            });

        Schema::table('materials', function (Blueprint $table) use ($legacyColumns): void {
            $table->dropColumn($legacyColumns);
        });
    }

    /**
     * Recreate the legacy shape so older code can boot. Data is not restored.
     */
    public function down(): void
    {
        $newColumns = array_values(array_filter(
            ['title', 'file_path', 'file_type'],
            fn (string $column): bool => Schema::hasColumn('materials', $column),
        ));

        if ($newColumns !== []) {
            Schema::table('materials', function (Blueprint $table) use ($newColumns): void {
                $table->dropColumn($newColumns);
            });
        }

        Schema::table('materials', function (Blueprint $table): void {
            if (! Schema::hasColumn('materials', 'original_name')) {
                $table->string('original_name')->nullable();
            }

            if (! Schema::hasColumn('materials', 'stored_name')) {
                $table->string('stored_name')->nullable();
            }

            if (! Schema::hasColumn('materials', 'mime_type')) {
                $table->string('mime_type')->nullable();
            }

            if (! Schema::hasColumn('materials', 'size')) {
                $table->unsignedBigInteger('size')->nullable();
            }

            if (! Schema::hasColumn('materials', 'disk')) {
                $table->string('disk')->nullable();
            }

            if (! Schema::hasColumn('materials', 'path')) {
                $table->string('path')->nullable();
            }

            if (! Schema::hasColumn('materials', 'failure_reason')) {
                $table->text('failure_reason')->nullable();
            }
        });
    }
};
