<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SkorPelatihanEkonomiKreatifSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'jawaban' => 'Dengan mengikuti pelatihan ini bisa menyelesaikan kendala dalam usaha ekonomi kreatif saya',
                'skor' => 3,
            ],
            [
                'jawaban' => 'Dengan mengikuti pelatihan ini saya mendapatkan keterampilan praktis yang dapat langsung diterapkan pada usaha ekonomi kreatif saya',
                'skor' => 2,
            ],
            [
                'jawaban' => 'Dengan mengikuti pelatihan ini saya dapat mendapatkan wawasan baru terkait pemasaran dan strategi pertumbuhan usaha ekonomi kreatif saya',
                'skor' => 1,
            ],
        ];

        DB::table('skor_pelatihan_ekonomi_kreatif')->insert($data);
    }
}
