<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $role_admin = Role::create(['name' => 'admin']);
        // $role_skpd = Role::create(['name' => 'skpd']);
        // $role_walikota = Role::create(['name' => 'walikota']);

        // $permission_verifikasi_pendaftaran = Permission::create(['name' => 'verifikasi pendaftaran']);
        // $permission_read_users = Permission::create(['name' => 'read users']);
        // $permission_delete_users = Permission::create(['name' => 'delete users']);
        // $permission_restore_users = Permission::create(['name' => 'restore users']);
        // $permission_read_dashboard = Permission::create(['name' => 'read dashboard']);

        // $permissions_admin = [$permission_verifikasi_pendaftaran, $permission_read_users, $permission_delete_users, $permission_restore_users, $permission_read_dashboard];
        // $permissions_skpd = [$permission_verifikasi_pendaftaran, $permission_read_dashboard];
        // $permissions_walikota= [$permission_read_dashboard];

        // $role_admin->syncPermissions($permissions_admin);
        // $role_skpd->syncPermissions($permissions_skpd);
        // $role_walikota->syncPermissions($permissions_walikota);


        //Permission (idempoten - tidak error jika dijalankan ulang)
        $permissions = [
            'view-dashboard',

            'view-banmod',
            'add-banmod',
            'edit-banmod',
            'delete-banmod',

            'view-pelatihan-banmod',
            'add-pelatihan-banmod',
            'edit-pelatihan-banmod',
            'delete-pelatihan-banmod',

            'view-pelatihan-kerja',
            'add-pelatihan-kerja',
            'edit-pelatihan-kerja',
            'delete-pelatihan-kerja',

            'view-pelatihan-umkm',
            'add-pelatihan-umkm',
            'edit-pelatihan-umkm',
            'delete-pelatihan-umkm',

            'view-pelatihan-pertanian',
            'add-pelatihan-pertanian',
            'edit-pelatihan-pertanian',
            'delete-pelatihan-pertanian',

            'view-lampiran-file',
            'add-lampiran-file',
            'edit-lampiran-file',
            'delete-lampiran-file',

            'view-master-banmod',
            'edit-master-banmod',

            'view-master-pencari-kerja',
            'add-master-pencari-kerja',
            'edit-master-pencari-kerja',

            'view-master-pertanian',
            'edit-master-pertanian',

            'view-user',
            'add-user',
            'edit-user',
            'delete-user',
            'restore-user',

            'view-role',
            'add-role',
            'edit-role',
            'delete-role',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        //Role (idempoten)
        foreach (['admin', 'dinkop', 'disperindag', 'pertanian', 'walikota'] as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        $roleAdmin = Role::findByName('admin');
        $roleAdmin->givePermissionTo([
            'view-dashboard',
            'view-banmod',
            'add-banmod',
            'edit-banmod',
            'delete-banmod',
            'view-pelatihan-banmod',
            'add-pelatihan-banmod',
            'edit-pelatihan-banmod',
            'delete-pelatihan-banmod',
            'view-pelatihan-kerja',
            'add-pelatihan-kerja',
            'edit-pelatihan-kerja',
            'delete-pelatihan-kerja',
            'view-pelatihan-umkm',
            'add-pelatihan-umkm',
            'edit-pelatihan-umkm',
            'delete-pelatihan-umkm',
            'view-pelatihan-pertanian',
            'add-pelatihan-pertanian',
            'edit-pelatihan-pertanian',
            'delete-pelatihan-pertanian',
            'view-lampiran-file',
            'add-lampiran-file',
            'edit-lampiran-file',
            'delete-lampiran-file',
            'view-master-banmod',
            'edit-master-banmod',
            'view-master-pencari-kerja',
            'add-master-pencari-kerja',
            'edit-master-pencari-kerja',
            'view-master-pertanian',
            'edit-master-pertanian',
            'view-user',
            'add-user',
            'edit-user',
            'delete-user',
            'restore-user',
            'view-role',
            'add-role',
            'edit-role',
            'delete-role',
        ]);

        $roleDinkop = Role::findByName('dinkop');
        $roleDinkop->givePermissionTo([
            'view-dashboard',
            'view-pelatihan-kerja',
            'add-pelatihan-kerja',
            'edit-pelatihan-kerja',
            'delete-pelatihan-kerja',
            'view-pelatihan-umkm',
            'add-pelatihan-umkm',
            'edit-pelatihan-umkm',
            'delete-pelatihan-umkm',
            'view-master-pencari-kerja',
            'add-master-pencari-kerja',
            'edit-master-pencari-kerja',
        ]);

        $roleDisperindag = Role::findByName('disperindag');
        $roleDisperindag->givePermissionTo([
            'view-dashboard',
            'view-banmod',
            'add-banmod',
            'edit-banmod',
            'delete-banmod',
            'view-pelatihan-banmod',
            'add-pelatihan-banmod',
            'edit-pelatihan-banmod',
            'delete-pelatihan-banmod',
            'view-master-banmod',
            'edit-master-banmod',
        ]);

        $rolePertanian = Role::findByName('pertanian');
        $rolePertanian->givePermissionTo([
            'view-dashboard',
            'view-pelatihan-pertanian',
            'add-pelatihan-pertanian',
            'edit-pelatihan-pertanian',
            'delete-pelatihan-pertanian',
            'view-master-pertanian',
            'edit-master-pertanian',
        ]);


        $roleWalikota = Role::findByName('walikota');
        $roleWalikota->givePermissionTo([
            'view-dashboard',
        ]);
    }
}
