<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $admin = User::create([
            'name' => 'Super Admin',
            'nik' => '3571010000000001',
            'email' => 'banmodpel.admin@kedirikota.go.id',
            'email_verified_at' => now(),
            'phone_number' => '085854445232',
            'password' => Hash::make('banmod123'),
        ]);
        $admin->assignRole('admin');

        $dinkop = User::create([
            'name' => 'Dinas Koperasi',
            'nik' => '3571010000000002',
            'email' => 'banmodpel.dinkop@kedirikota.go.id',
            'email_verified_at' => now(),
            'phone_number' => '085133564587',
            'password' => Hash::make('{P4ssw0rd}'),
        ]);
        $dinkop->assignRole('dinkop');

        $disperindag = User::create([
            'name' => 'Dinas Perindustrian dan Perdagangan',
            'nik' => '3571010000000003',
            'email' => 'banmodpel.disperindag@kedirikota.go.id',
            'email_verified_at' => now(),
            'phone_number' => '085733566587',
            'password' => Hash::make('{P4ssw0rd}'),
        ]);
        $disperindag->assignRole('disperindag');

        $pertanian = User::create([
            'name' => 'Dinas Pertanian',
            'nik' => '3571010000000004',
            'email' => 'banmodpel.pertanian@kedirikota.go.id',
            'email_verified_at' => now(),
            'phone_number' => '085733562587',
            'password' => Hash::make('{P4ssw0rd}'),
        ]);
        $pertanian->assignRole('pertanian');

        $walikota = User::create([
            'name' => 'Walikota',
            'nik' => '3571010000000005',
            'email' => 'banmodpel.walikota@kedirikota.go.id',
            'email_verified_at' => now(),
            'phone_number' => '085733568587',
            'password' => Hash::make('{P4ssw0rd}'),
        ]);
        $walikota->assignRole('walikota');
    }
}
