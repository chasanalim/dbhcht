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
        $users = [
            [
                'name' => 'Admin',
                'nik' => '3571010000000001',
                'email' => 'banmodpel.admin@kedirikota.go.id',
                'email_verified_at' => now(),
                'phone_number' => '085854445232',
                'address' => 'Jl. Basuki Rahmat No. 15, Pocanan, Kota Kediri',
                'password' => Hash::make('banmod123'),
                'role' => 'admin',
            ],
            [
                'name' => 'Skpd',
                'nik' => '3571010000000002',
                'email' => 'banmodpel.skpd@kedirikota.go.id',
                'email_verified_at' => now(),
                'phone_number' => '085733564587',
                'address' => 'Jl. Basuki Rahmat No. 15, Pocanan, Kota Kediri',
                'password' => Hash::make('{P4ssw0rd}'),
                'role' => 'skpd',
            ],
            [
                'name' => 'Walikota',
                'nik' => '3571010000000003',
                'email' => 'banmodpel.walikota@kedirikota.go.id',
                'email_verified_at' => now(),
                'phone_number' => '081233478177',
                'address' => 'Jl. Basuki Rahmat No. 15, Pocanan, Kota Kediri',
                'password' => Hash::make('{P4ssw0rd}'),
                'role' => 'walikota',
            ],
        ];

        foreach ($users as $user) {
            $created_user = User::create([
                'name' => $user['name'],
                'nik' => $user['nik'],
                'email' => $user['email'],
                'email_verified_at' => $user['email_verified_at'],
                'phone_number' => $user['phone_number'],
                'address' => $user['address'],
                'password' => $user['password'],
                'role' => $user['role'],
            ]);

            $created_user->assignRole($user['role']);
        }
    }
}
