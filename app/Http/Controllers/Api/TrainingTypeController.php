<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TrainingType;
use Illuminate\Http\Request;

class TrainingTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            TrainingType::orderBy('order')->get()
        );
    }

    /**
     * Get training types for carousel (with full details)
     */
    public function carousel()
    {
        return response()->json(
            TrainingType::orderBy('order')->get()->map(function($training) {
                return [
                    'id' => $training->id,
                    'title' => $training->title,
                    'description' => $training->description,
                    'image' => $training->image,
                    'requirements' => $training->requirements,
                    'duration' => $training->duration,
                    'location' => $training->location,
                    'jenis' => $training->value,
                    'comingSoon' => $training->coming_soon,
                    'closed' => $training->closed,
                ];
            })->toArray()
        );
    }

    /**
     * Get training options for select dropdown
     */
    public function options()
    {
        return response()->json(
            TrainingType::orderBy('order')->get()->map(function($training) {
                return [
                    'value' => $training->value,
                    'label' => $training->label,
                    'isDisabled' => $training->is_disabled,
                ];
            })->toArray()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TrainingType $trainingType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TrainingType $trainingType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TrainingType $trainingType)
    {
        //
    }
}
