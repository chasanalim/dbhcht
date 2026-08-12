<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class BanmodRegistrationController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'role:admin',
        ];
    }

    public function toggle(Request $request): JsonResponse
    {
        $request->validate(['open' => 'required|boolean']);

        Setting::updateOrCreate(
            ['key' => 'banmod_registration_open'],
            ['value' => $request->boolean('open') ? '1' : '0']
        );

        return response()->json([
            'success' => true,
            'open' => $request->boolean('open'),
            'message' => 'Status pendaftaran Banmod berhasil diperbarui.',
        ]);
    }
}