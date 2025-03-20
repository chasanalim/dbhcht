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
        $role_admin = Role::create(['name' => 'admin']);
        $role_skpd = Role::create(['name' => 'skpd']);
        $role_walikota = Role::create(['name' => 'walikota']);

        $permission_verifikasi_pendaftaran = Permission::create(['name' => 'verifikasi pendaftaran']);
        $permission_read_users = Permission::create(['name' => 'read users']);
        $permission_delete_users = Permission::create(['name' => 'delete users']);
        $permission_restore_users = Permission::create(['name' => 'restore users']);
        $permission_read_dashboard = Permission::create(['name' => 'read dashboard']);

        $permissions_admin = [$permission_verifikasi_pendaftaran, $permission_read_users, $permission_delete_users, $permission_restore_users, $permission_read_dashboard];
        $permissions_skpd = [$permission_verifikasi_pendaftaran, $permission_read_dashboard];
        $permissions_walikota= [$permission_read_dashboard];

        $role_admin->syncPermissions($permissions_admin);
        $role_skpd->syncPermissions($permissions_skpd);
        $role_walikota->syncPermissions($permissions_walikota);
    }
}
