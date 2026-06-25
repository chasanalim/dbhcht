<?php

namespace Database\Seeders;

use App\Models\JumlahTenagaKerja;
use App\Models\LamaUsaha;
use App\Models\PenerimaBanmod;
use App\Models\SkorPelatihanBanmod;
use App\Models\User;
use Database\Seeders\TahunPelaksanaanSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            UserRoleSeeder::class,
            UserSeeder::class,
            TrainingTypeSeeder::class,
            KategoriBanmodSeeder::class,
            KlasterUsahaSeeder::class,
            LamaUsahaSeeder::class,
            JumlahTenagaKerjaSeeder::class,
            BrutoSeeder::class,
            TanggunganKeluargaSeeder::class,
            StatusTempatTinggalSeeder::class,
            JumlahLegalitasSeeder::class,
            JumlahTeknologiDigitalSeeder::class,
            PenyerapanTenagaMiskinSeeder::class,
            LampiranSeeder::class,
            PenerimaBanmodSeeder::class,
            PenerimaBanmodWusSeeder::class,
            SkorPelatihanUmkmSeeder::class,
            JenisPelatihanPetaniSeeder::class,
            SkorPelatihanPetaniSeeder::class,
            KelompokTaniSeeder::class,
            KelompokPelatihanPetaniSeeder::class,
            MasaAktifKelompokTaniSeeder::class,
            JenisPelatihanKetKerjaSeeder::class,
            AlasanPelatihanKetKerjaSeeder::class,
            SkorPelatihanBanmodSeeder::class,
            RefPendidikanSeeder::class,
            MasterPKLSeeder::class,
            SkorPelatihanEkonomiKreatifSeeder::class,
            TahunPelaksanaanSeeder::class,
        ]);
    }
}
