<?php

namespace Database\Seeders;

use App\Models\BanmodTrainingOption;
use Illuminate\Database\Seeder;

class BanmodTrainingOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $options = [
            'Penjahit Pemula',
            'Penjahit Naik Kelas',
            'Makanan Tradisional',
            'Digma Kerajinan',
            'Kewirausahaan Kuliner',
            'Kewirausahaan MUA',
        ];

        foreach ($options as $index => $label) {
            BanmodTrainingOption::updateOrCreate(
                ['value' => $label],
                [
                    'label' => $label,
                    'is_active' => true,
                    'order' => $index + 1,
                ]
            );
        }
    }
}
