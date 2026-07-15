<?php

namespace Database\Seeders;

use App\Models\TahunPelaksanaan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TahunPelaksanaanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TahunPelaksanaan::create([
            'tahun' => '2024',
            'is_active' => true,
        ]);
        TahunPelaksanaan::create([
            'tahun' => '2025',
            'is_active' => true,
        ]);
        TahunPelaksanaan::create([
            'tahun' => '2026',
            'is_active' => true,
        ]);
    }
}
