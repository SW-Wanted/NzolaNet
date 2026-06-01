<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', '/docs');

Route::get('/docs', function () {
    return view('docs');
})->name('docs');

Route::get('/docs/openapi.yaml', function () {
    return response()->file(base_path('docs/openapi/nzolanet.yaml'), [
        'Content-Type' => 'application/yaml; charset=UTF-8',
        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
    ]);
})->name('docs.openapi');
