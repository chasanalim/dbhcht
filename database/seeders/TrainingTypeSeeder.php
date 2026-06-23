<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TrainingType;

class TrainingTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $trainings = [
            [
                'value' => 'keterampilan',
                'label' => 'Pelatihan Keterampilan untuk Pencari Kerja',
                'title' => 'Pelatihan Keterampilan untuk Pencari Kerja',
                'description' => 'Pelatihan teknis dan soft skill untuk meningkatkan daya saing pencari kerja.',
                'image' => 'https://i.ibb.co.com/hxsTSvp4/Chat-GPT-Image-Dec-2-2025-09-30-58-AM.jpg',
                'requirements' => json_encode([
                    ['label' => 'Usia Min', 'value' => '18 tahun'],
                    ['label' => 'Usia Maks', 'value' => '45 tahun'],
                ]),
                'duration' => '-',
                'location' => 'Kota Kediri',
                'is_disabled' => true,
                'coming_soon' => false,
                'closed' => true,
                'order' => 1,
            ],
            [
                'value' => 'penerimabanmod',
                'label' => 'Pelatihan Keterampilan Penerima Banmod',
                'title' => 'Pelatihan Keterampilan untuk Penerima Banmod',
                'description' => 'Pelatihan lanjutan bagi penerima bantuan modal untuk mengembangkan usahanya.',
                'image' => 'https://i.ibb.co.com/m54dMcfy/Chat-GPT-Image-Dec-2-2025-09-28-04-AM.jpg',
                'requirements' => json_encode([
                    ['label' => 'Penerima', 'value' => 'Program Banmod DBHCHT'],
                ]),
                'duration' => '-',
                'location' => 'Disperdagin Kota Kediri',
                'is_disabled' => true,
                'coming_soon' => true,
                'closed' => false,
                'order' => 2,
            ],
            [
                'value' => 'ekraf',
                'label' => 'Pelatihan Ekonomi Kreatif',
                'title' => 'Pelatihan Ekonomi Kreatif',
                'description' => 'Peningkatan kapasitas pelaku Ekonomi Kreatif.',
                'image' => 'https://i.ibb.co.com/93zWWdfg/Chat-GPT-Image-Dec-2-2025-09-21-16-AM.jpg',
                'requirements' => json_encode([
                    ['label' => 'Status', 'value' => 'Pelaku Ekonomi Kreatif'],
                ]),
                'duration' => '-',
                'location' => 'Kota Kediri',
                'is_disabled' => true,
                'coming_soon' => false,
                'closed' => true,
                'order' => 3,
            ],
            [
                'value' => 'umkm',
                'label' => 'Pelatihan UMKM',
                'title' => 'Pelatihan UMKM',
                'description' => 'Peningkatan kapasitas pelaku UMKM dalam peningkatan kualitas produk.',
                'image' => 'https://i.ibb.co.com/v6zWczyX/Chat-GPT-Image-Dec-3-2025-10-45-27-AM.jpg',
                'requirements' => json_encode([
                    ['label' => 'Status', 'value' => 'Pelaku UMKM aktif'],
                ]),
                'duration' => '-',
                'location' => 'Gedung UMKM Center',
                'is_disabled' => true,
                'coming_soon' => false,
                'closed' => true,
                'order' => 4,
            ],
            [
                'value' => 'petani',
                'label' => 'Pelatihan Pertanian',
                'title' => 'Pelatihan Pertanian',
                'description' => 'Teknik pertanian modern dan pemanfaatan alat pertanian terbaru.',
                'image' => 'https://dokar.kendalkab.go.id/upload/berita/1688524912IMG_20230704_163951.jpg',
                'requirements' => json_encode([
                    ['label' => 'Pekerjaan', 'value' => 'Petani aktif'],
                ]),
                'duration' => '-',
                'location' => 'Balai Pertanian',
                'is_disabled' => true,
                'coming_soon' => false,
                'closed' => true,
                'order' => 5,
            ],
        ];

        foreach ($trainings as $training) {
            TrainingType::firstOrCreate(
                ['value' => $training['value']],
                $training
            );
        }
    }
}
