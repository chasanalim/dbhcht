<?php

namespace Database\Seeders;

use App\Models\UmkmTrainingOption;
use Illuminate\Database\Seeder;

class UmkmTrainingOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $options = [
            'Digital Marketing',
            'Manajemen Usaha dan Keuangan',
            'Conten Creator',
            'Desain Kemasan dan Packaging',
            'Desain Motif Tenun dan Batik',
            'Frozen Food',
            'Barista',
        ];

        foreach ($options as $index => $label) {
            UmkmTrainingOption::updateOrCreate(
                ['label' => $label],
                [
                    'is_active' => true,
                    'order' => $index + 1,
                ]
            );
        }
    }
}
