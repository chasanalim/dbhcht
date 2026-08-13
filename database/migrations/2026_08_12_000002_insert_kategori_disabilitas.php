<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('kategori_banmods')->insertOrIgnore([
            'id' => 7,
            'jenis' => 1,
            'nama' => 'DISABILITAS',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('kategori_banmods')->where('id', 7)->delete();
    }
};
