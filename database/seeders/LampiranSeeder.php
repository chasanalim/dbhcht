<?php

namespace Database\Seeders;

use App\Models\LampiranFile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LampiranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lampiran = [
            [
                'nama' => 'Buku Pedoman',
                'deskripsi' => 'Buku Pedoman Banmod 2025.pdf',
                'file_name' => 'buku-pedoman.pdf',
                'kategori' => 'banmod',
            ],
            [
                'nama' => 'Surat Pernyataan',
                'deskripsi' => 'Surat Pernyataan Penerima Banmod 2025.pdf',
                'file_name' => 'surat-pernyataan.pdf',
                'kategori' => 'banmod',
            ],
            [
                'nama' => 'RAB Banmod',
                'deskripsi' => 'RAB Banmod 2025.pdf',
                'file_name' => 'rab.pdf',
                'kategori' => 'banmod',
            ],
            [
                'nama' => 'Pencairan Banmod',
                'deskripsi' => 'Petunjuk Pencairan Banmod 2025.pdf',
                'file_name' => 'pencairan.pdf',
                'kategori' => 'banmod',
            ],
            [
                'nama' => 'Panduan Banmod',
                'deskripsi' => 'Panduan Banmod 2025.pdf',
                'file_name' => 'panduan.pdf',
                'kategori' => 'pelatihan',
            ],
        ];

        LampiranFile::insert($lampiran);
    }
}
