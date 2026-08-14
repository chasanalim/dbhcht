<?php

use App\Models\User;

test('authenticated user can access dashboard without sql errors', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('admin.dashboard'));

    $response->assertOk();
});
