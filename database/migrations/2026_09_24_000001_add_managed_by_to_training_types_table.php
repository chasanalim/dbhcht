<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('training_types', function (Blueprint $table) {
            $table->string('managed_by')->nullable()->after('value')->index();
        });

        $assignments = [
            'dinkop' => ['keterampilan', 'umkm'],
            'disperindag' => ['penerimabanmod', 'ekraf'],
            'pertanian' => ['petani'],
        ];

        foreach ($assignments as $manager => $values) {
            DB::table('training_types')
                ->whereIn('value', $values)
                ->update(['managed_by' => $manager]);
        }
    }

    public function down(): void
    {
        Schema::table('training_types', function (Blueprint $table) {
            $table->dropIndex(['managed_by']);
            $table->dropColumn('managed_by');
        });
    }
};
