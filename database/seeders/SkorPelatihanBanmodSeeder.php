<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SkorPelatihanBanmod;

class SkorPelatihanBanmodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $data = [
            // Perkembangan Omzet
            ['kategori' => 'perkembangan_omzet', 'jawaban' => 'Meningkat', 'skor' => 3],
            ['kategori' => 'perkembangan_omzet', 'jawaban' => 'Tetap', 'skor' => 2],
            ['kategori' => 'perkembangan_omzet', 'jawaban' => 'Turun', 'skor' => 1],

            // Perkembangan Tenaga Kerja
            ['kategori' => 'perkembangan_tenaga_kerja', 'jawaban' => 'Bertambah', 'skor' => 3],
            ['kategori' => 'perkembangan_tenaga_kerja', 'jawaban' => 'Tetap', 'skor' => 2],
            ['kategori' => 'perkembangan_tenaga_kerja', 'jawaban' => 'Berkurang', 'skor' => 1],

            // Skor Ketrampilan
            ['kategori' => 'ketrampilan', 'jawaban' => 'Sangat Setuju', 'skor' => 3],
            ['kategori' => 'ketrampilan', 'jawaban' => 'Setuju', 'skor' => 2],
            ['kategori' => 'ketrampilan', 'jawaban' => 'Kurang Setuju', 'skor' => 1],

            // Skor Kualitas Produk
            ['kategori' => 'kualitas_produk', 'jawaban' => 'Sangat Setuju', 'skor' => 3],
            ['kategori' => 'kualitas_produk', 'jawaban' => 'Setuju', 'skor' => 2],
            ['kategori' => 'kualitas_produk', 'jawaban' => 'Kurang Setuju', 'skor' => 1],

            // Skor Permasalahan Usaha
            ['kategori' => 'permasalahan_usaha', 'jawaban' => 'Sangat Setuju', 'skor' => 3],
            ['kategori' => 'permasalahan_usaha', 'jawaban' => 'Setuju', 'skor' => 2],
            ['kategori' => 'permasalahan_usaha', 'jawaban' => 'Kurang Setuju', 'skor' => 1],

            // Skor Mengisi Waktu
            ['kategori' => 'mengisi_waktu', 'jawaban' => 'Sangat Setuju', 'skor' => 3],
            ['kategori' => 'mengisi_waktu', 'jawaban' => 'Setuju', 'skor' => 2],
            ['kategori' => 'mengisi_waktu', 'jawaban' => 'Kurang Setuju', 'skor' => 1],

            // Skor Diajak Teman
            ['kategori' => 'diajak_teman', 'jawaban' => 'Sangat Setuju', 'skor' => 3],
            ['kategori' => 'diajak_teman', 'jawaban' => 'Setuju', 'skor' => 2],
            ['kategori' => 'diajak_teman', 'jawaban' => 'Kurang Setuju', 'skor' => 1],
        ];

        foreach ($data as $item) {
            SkorPelatihanBanmod::create($item);
        }
    }
}
