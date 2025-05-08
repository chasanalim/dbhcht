<?php

namespace App\Http\Middleware;

use App\Models\LampiranFile;
use App\Models\PenerimaBanmod;
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
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'roles' => $request->user()->roles->pluck('name'),
                    'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                ] : null,
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
            'can' => $request->user() ? [
                'viewBanmod' => $request->user()->can('view-banmod'),
                'viewUmkm' => $request->user()->can('view-pelatihan-umkm'),
                'viewKerja' => $request->user()->can('view-pelatihan-kerja'),
                'viewPelatihanBanmod' => $request->user()->can('view-pelatihan-banmod'),
                'viewPertanian' => $request->user()->can('view-pelatihan-pertanian'),

                'viewMasterLampiranFile' => $request->user()->can('view-lampiran-file'),
                'createMasterLampiranFile' => $request->user()->can('add-lampiran-file'),
                'editMasterLampiranFile' => $request->user()->can('edit-lampiran-file'),
                'deleteMasterLampiranFile' => $request->user()->can('delete-lampiran-file'),

                'viewMasterBanmod' => $request->user()->can('view-master-banmod'),
                'editMasterBanmod' => $request->user()->can('edit-master-banmod'),

                'viewMasterPertanian' => $request->user()->can('view-master-pertanian'),
                'editMasterPertanian' => $request->user()->can('edit-master-pertanian'),

                'viewUser' => $request->user()->can('view-user'),
                'createUser' => $request->user()->can('add-user'),
                'editUser' => $request->user()->can('edit-user'),
                'deleteUser' => $request->user()->can('delete-user'),

                'viewRole' => $request->user()->can('view-role'),
                'createRole' => $request->user()->can('add-role'),
                'editRole' => $request->user()->can('edit-role'),
                'deleteRole' => $request->user()->can('delete-role'),
            ] : [],
        ];
    }
}
