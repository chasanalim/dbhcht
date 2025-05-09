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


        //Permission
        Permission::create(['name' => 'view-dashboard', 'guard_name' => 'web']);

        Permission::create(['name' => 'view-banmod', 'guard_name' => 'web']);
        Permission::create(['name' => 'add-banmod', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit-banmod', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete-banmod', 'guard_name' => 'web']);

        Permission::create(['name' => 'view-pelatihan-banmod', 'guard_name' => 'web']);
        Permission::create(['name' => 'add-pelatihan-banmod', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit-pelatihan-banmod', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete-pelatihan-banmod', 'guard_name' => 'web']);

        Permission::create(['name' => 'view-pelatihan-kerja', 'guard_name' => 'web']);
        Permission::create(['name' => 'add-pelatihan-kerja', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit-pelatihan-kerja', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete-pelatihan-kerja', 'guard_name' => 'web']);

        Permission::create(['name' => 'view-pelatihan-umkm', 'guard_name' => 'web']);
        Permission::create(['name' => 'add-pelatihan-umkm', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit-pelatihan-umkm', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete-pelatihan-umkm', 'guard_name' => 'web']);

        Permission::create(['name' => 'view-pelatihan-pertanian', 'guard_name' => 'web']);
        Permission::create(['name' => 'add-pelatihan-pertanian', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit-pelatihan-pertanian', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete-pelatihan-pertanian', 'guard_name' => 'web']);

        Permission::create(['name' => 'view-lampiran-file', 'guard_name' => 'web']);
        Permission::create(['name' => 'add-lampiran-file', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit-lampiran-file', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete-lampiran-file', 'guard_name' => 'web']);

        Permission::create(['name' => 'view-master-banmod', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit-master-banmod', 'guard_name' => 'web']);

        Permission::create(['name' => 'view-master-pertanian', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit-master-pertanian', 'guard_name' => 'web']);

        Permission::create(['name' => 'view-user', 'guard_name' => 'web']);
        Permission::create(['name' => 'add-user', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit-user', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete-user', 'guard_name' => 'web']);
        Permission::create(['name' => 'restore-user', 'guard_name' => 'web']);

        Permission::create(['name' => 'view-role', 'guard_name' => 'web']);
        Permission::create(['name' => 'add-role', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit-role', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete-role', 'guard_name' => 'web']);

        //Role
        Role::create(['name' => 'admin', 'guard_name' => 'web']);
        Role::create(['name' => 'dinkop', 'guard_name' => 'web']);
        Role::create(['name' => 'disperindag', 'guard_name' => 'web']);
        Role::create(['name' => 'pertanian', 'guard_name' => 'web']);
        Role::create(['name' => 'walikota', 'guard_name' => 'web']);

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
