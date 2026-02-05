<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CourseController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Course routes
    Route::apiResource('courses', CourseController::class);
    Route::post('courses/{id}/enroll', [CourseController::class, 'enroll']);

    // TODO: Add lesson, quiz, assignment routes
});
