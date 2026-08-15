<?php

namespace Database\Seeders;

use App\Models\EkrafTrainingOption;
use Illuminate\Database\Seeder;

class EkrafTrainingOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $options = [
            ['value' => 'dkv', 'label' => 'Desain Komunikasi Visual'],
            ['value' => 'mua', 'label' => 'Makeup Artist (MUA)'],
            ['value' => 'diversifikasi_kriya', 'label' => 'Diversifikasi Kriya'],
            ['value' => 'tour_guide', 'label' => 'Tour Guide'],
            ['value' => 'kuliner_tradisional', 'label' => 'Kuliner Tradisional Food'],
            ['value' => 'pelatihan_export', 'label' => 'Pelatihan Export'],
        ];

        foreach ($options as $index => $option) {
            EkrafTrainingOption::updateOrCreate(
                ['value' => $option['value']],
                [
                    'label' => $option['label'],
                    'is_active' => true,
                    'order' => $index + 1,
                ]
            );
        }
    }
}
