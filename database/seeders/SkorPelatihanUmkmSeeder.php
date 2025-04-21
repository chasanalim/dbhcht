<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SkorPelatihanUmkmSeeder extends Seeder
{
    public function run()
    {
        $data = [
            // Alasan Mengikuti Pelatihan
            [
                'kategori' => 'alasan',
                'jawaban' => 'Dengan mengikuti pelatihan ini bisa menyelesaikan kendala dalam usaha saya',
                'skor' => 3,
            ],
            [
                'kategori' => 'alasan',
                'jawaban' => 'Dengan mengikuti pelatihan ini saya mendapatkan keterampilan praktis yang dapat langsung diterapkan pada usaha saya',
                'skor' => 2,
            ],
            [
                'kategori' => 'alasan',
                'jawaban' => 'Dengan mengikuti pelatihan ini saya dapat mendapatkan wawasan baru terkait pemasaran dan strategi pertumbuhan usaha saya',
                'skor' => 1,
            ],

            // Kesesuaian Usaha
            [
                'kategori' => 'kesesuaian',
                'jawaban' => 'Saya mengikuti pelatihan yang sesuai dengan perkembangan usaha saya saat ini',
                'skor' => 3,
            ],
            [
                'kategori' => 'kesesuaian',
                'jawaban' => 'Saya mengikuti pelatihan ini dapat meningkatkan efisiensi dan kualitas usaha saya',
                'skor' => 2,
            ],
            [
                'kategori' => 'kesesuaian',
                'jawaban' => 'Saya mengikuti pelatihan ini sesuai dengan relevansi tren terbaru dalam industri usaha yang saya jalani',
                'skor' => 1,
            ],

            // Pengalaman Mengikuti Pelatihan
            [
                'kategori' => 'pengalaman',
                'jawaban' => 'Tidak pernah',
                'skor' => 3,
            ],
            [
                'kategori' => 'pengalaman',
                'jawaban' => 'Pernah / mengikuti pelatihan lanjutan',
                'skor' => 1,
            ],
        ];

        DB::table('skor_pelatihan_umkm')->insert($data);
    }
}
