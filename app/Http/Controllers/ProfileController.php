<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {

        $user = Auth::user();

        return Inertia::render('Admin/User/Edit', [
            'title' => 'Edit Profile',
            'user' => $user,
            'action' => route('admin.profile.update'),
            'method' => 'PATCH',
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $inputNoHp = $request->phone_number;

        // Format phone number
        if (substr($inputNoHp, 0, 1) === '0') {
            $formattedNoHp = '62' . substr($inputNoHp, 1);
        } elseif (substr($inputNoHp, 0, 2) === '62') {
            $formattedNoHp = $inputNoHp;
        } else {
            return back()->with('error', 'Format nomor WhatsApp tidak valid.');
        }

        // Base validation rules
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'numeric', 'digits:16', Rule::unique('users')->ignore($user->id)],
            'phone_number' => [
                'required',
                'numeric',
                'digits_between:10,13',
                Rule::unique('users')->ignore($user->id)
            ],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
        ];

        // Add password validation if provided
        if ($request->filled('password')) {
            $rules['password'] = [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'confirmed'
            ];
        }

        try {
            // Validate request with custom messages
            $request->validate($rules, [
                'password.min' => 'Password minimal 8 karakter',
                'password.regex' => 'Password harus mengandung minimal 1 huruf kapital dan 1 angka',
            ]);

            // Prepare update data
            $updateData = [
                'name' => $request->name,
                'nik' => $request->nik,
                'phone_number' => $formattedNoHp,
                'email' => $request->email,
            ];

            // Add password if provided
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            // Update user
            $user->update($updateData);

            return redirect()->route('admin.profile.edit')->with([
                'type' => 'success',
                'message' => 'Profile berhasil diperbarui'
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.profile.edit')->with([
                'type' => 'error',
                'message' => 'Gagal memperbarui profile: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
