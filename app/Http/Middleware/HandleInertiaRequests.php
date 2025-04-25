<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    private function _navigations(Request $request): array
    {
        $permissions = $request->user() ? $request->user()->getPermissionsViaRoles()->pluck('name')->toArray() : [];

        return [
            [
                'label' => 'Beranda',
                'route' => 'home',
                'icon' => 'bi bi-house',
                'show' => true,
            ],
            [
                'label' => 'Dashboard',
                'route' => 'admin.dashboard',
                'icon' => 'fa-podcast',
                'show' => in_array('read dashboard', $permissions),
            ],
            [
                'label' => 'Download File',
                'route' => 'download',
                'icon' => 'bi bi-file-earmark-arrow-down',
                'show' => true,
                // 'show' => in_array('read dashboard', $permissions),
            ],
            [
                'label' => 'Daftar Banmod',
                'route' => 'banmod',
                'icon' => 'bi bi-shop-window',
                'show' => true,
            ],
            [
                'label' => 'List Pendaftar Banmod',
                'route' => 'peserta.get',
                'icon' => 'bi bi-person-lines-fill',
                'show' => true,
            ],
            [
                'label' => 'Daftar Pelatihan',
                'route' => 'pelatihan',
                'icon' => 'bi bi-person-arms-up',
                'show' => true,
            ],
        ];
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? User::findOrFail(Auth::id()) : null,
                'roles' => $request->user() ? $request->user()->roles->pluck('name') : [],
                'permissions' => $request->user() ? $request->user()->getPermissionsViaRoles()->pluck('name') : [],
            ],
            'navigations' => $this->_navigations($request),
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'env' => [
                'app_url_esuket' => env('APP_URL_ESUKET'),
                'app_email_banmod' => env('APP_EMAIL_BANMOD'),
                'app_wa_banmod' => env('APP_WA_BANMOD'),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'can' => [
                'viewBanmod' => $request->user()?->hasPermissionTo('view-banmod'),
                'viewUmkm' => $request->user()?->hasPermissionTo('view-pelatihan-umkm'),
                'viewKerja' => $request->user()?->hasPermissionTo('view-pelatihan-kerja'),
                'viewPelatihanBanmod' => $request->user()?->hasPermissionTo('view-pelatihan-banmod'),
                'viewPertanian' => $request->user()?->hasPermissionTo('view-pelatihan-pertanian'),
                'viewMasterLampiranFile' => $request->user()?->hasPermissionTo('view-lampiran-file'),
                'viewMasterBanmod' => $request->user()?->hasPermissionTo('view-master-banmod'),
                'viewMasterPertanian' => $request->user()?->hasPermissionTo('view-master-pertanian'),
                'viewUser' => $request->user()?->hasPermissionTo('view-user'),
                'viewPrivileges' => $request->user()?->hasPermissionTo('view-role'),
            ],
        ];
    }
}
