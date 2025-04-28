<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SkorPelatihanBanmodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $data = [
            ['kategori' => 'ketrampilan', 'jawaban' => 'Sangat Setuju', 'skor' => 3],
            ['kategori' => 'ketrampilan', 'jawaban' => 'Setuju', 'skor' => 2],
            ['kategori' => 'ketrampilan', 'jawaban' => 'Kurang Setuju', 'skor' => 1],

            ['kategori' => 'kualitas_produk', 'jawaban' => 'Sangat Setuju', 'skor' => 3],
            ['kategori' => 'kualitas_produk', 'jawaban' => 'Setuju', 'skor' => 2],
            ['kategori' => 'kualitas_produk', 'jawaban' => 'Kurang Setuju', 'skor' => 1],

            ['kategori' => 'permasalahan_usaha', 'jawaban' => 'Sangat Setuju', 'skor' => 3],
            ['kategori' => 'permasalahan_usaha', 'jawaban' => 'Setuju', 'skor' => 2],
            ['kategori' => 'permasalahan_usaha', 'jawaban' => 'Kurang Setuju', 'skor' => 1],

            ['kategori' => 'mengisi_waktu', 'jawaban' => 'Sangat Setuju', 'skor' => 3],
            ['kategori' => 'mengisi_waktu', 'jawaban' => 'Setuju', 'skor' => 2],
            ['kategori' => 'mengisi_waktu', 'jawaban' => 'Kurang Setuju', 'skor' => 1],

            ['kategori' => 'diajak_teman', 'jawaban' => 'Sangat Setuju', 'skor' => 3],
            ['kategori' => 'diajak_teman', 'jawaban' => 'Setuju', 'skor' => 2],
            ['kategori' => 'diajak_teman', 'jawaban' => 'Kurang Setuju', 'skor' => 1],
        ];

        foreach ($data as $item) {
            \App\Models\SkorPelatihanBanmod::create($item);
        }
    }
}
