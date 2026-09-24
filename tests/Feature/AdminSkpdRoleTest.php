<?php

use App\Models\TrainingType;
use App\Models\User;
use Database\Seeders\UserRoleSeeder;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->seed(UserRoleSeeder::class);
});

it('creates admin SKPD roles with parent permissions plus tipe pelatihan access', function (string $adminRole, string $parentRole) {
    $expectedPermissions = Role::findByName($parentRole)
        ->permissions
        ->pluck('name')
        ->push('manage-tipe-pelatihan')
        ->sort()
        ->values()
        ->all();

    $actualPermissions = Role::findByName($adminRole)
        ->permissions
        ->pluck('name')
        ->sort()
        ->values()
        ->all();

    expect($actualPermissions)->toBe($expectedPermissions);
})->with([
    ['admin pertanian', 'pertanian'],
    ['admin dinkop', 'dinkop'],
    ['admin disperindag', 'disperindag'],
]);

it('allows admin SKPD roles to access tipe pelatihan', function (string $role) {
    $user = User::factory()->create();
    $user->assignRole($role);

    $this->actingAs($user)
        ->get(route('admin.pelatihan.index'))
        ->assertOk();
})->with([
    'admin pertanian',
    'admin dinkop',
    'admin disperindag',
]);

it('always allows the main admin role to access tipe pelatihan', function () {
    $adminRole = Role::findByName('admin');
    $adminRole->revokePermissionTo('manage-tipe-pelatihan');

    $user = User::factory()->create();
    $user->assignRole('admin');

    $this->actingAs($user)
        ->get(route('admin.pelatihan.index'))
        ->assertOk();
});

it('does not add tipe pelatihan access to the parent SKPD roles', function (string $role) {
    $user = User::factory()->create();
    $user->assignRole($role);

    $this->actingAs($user)
        ->get(route('admin.pelatihan.index'))
        ->assertForbidden();
})->with([
    'pertanian',
    'dinkop',
    'disperindag',
]);

it('only lists training types managed by the admin SKPD role', function (string $role, array $visibleManagers) {
    foreach (['dinkop', 'disperindag', 'pertanian'] as $manager) {
        TrainingType::create([
            'value' => "pelatihan-{$manager}",
            'managed_by' => $manager,
            'label' => "Pelatihan {$manager}",
            'title' => "Pelatihan {$manager}",
            'description' => 'Deskripsi',
            'location' => 'Kota Kediri',
        ]);
    }

    $user = User::factory()->create();
    $user->assignRole($role);

    $response = $this->actingAs($user)
        ->getJson(route('admin.pelatihan.index'))
        ->assertOk();

    expect(collect($response->json('data'))->pluck('managed_by')->unique()->values()->all())
        ->toBe($visibleManagers);
})->with([
    ['admin pertanian', ['pertanian']],
    ['admin dinkop', ['dinkop']],
    ['admin disperindag', ['disperindag']],
]);

it('forces newly created training types to the admin SKPD manager', function (string $role, string $manager) {
    $user = User::factory()->create();
    $user->assignRole($role);

    $this->actingAs($user)
        ->post(route('admin.pelatihan.store'), [
            'value' => 'pelatihan-baru',
            'managed_by' => 'manager-lain',
            'label' => 'Pelatihan Baru',
            'title' => 'Pelatihan Baru',
            'description' => 'Deskripsi pelatihan baru',
            'location' => 'Kota Kediri',
        ])
        ->assertRedirect(route('admin.pelatihan.index'));

    $this->assertDatabaseHas('training_types', [
        'value' => 'pelatihan-baru',
        'managed_by' => $manager,
    ]);
})->with([
    ['admin pertanian', 'pertanian'],
    ['admin dinkop', 'dinkop'],
    ['admin disperindag', 'disperindag'],
]);

it('prevents an admin SKPD from editing or deleting another manager training type', function () {
    $trainingType = TrainingType::create([
        'value' => 'pelatihan-pertanian',
        'managed_by' => 'pertanian',
        'label' => 'Pelatihan Pertanian',
        'title' => 'Pelatihan Pertanian',
        'description' => 'Deskripsi',
        'location' => 'Kota Kediri',
    ]);

    $user = User::factory()->create();
    $user->assignRole('admin dinkop');

    $this->actingAs($user)
        ->get(route('admin.pelatihan.edit', $trainingType))
        ->assertNotFound();

    $this->actingAs($user)
        ->delete(route('admin.pelatihan.destroy', $trainingType))
        ->assertNotFound();

    $this->assertDatabaseHas('training_types', ['id' => $trainingType->id]);
});
