<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

function getMimeType($file) {
    $mimeTypes = [
        '/\.html$/' => 'text/html',
        '/\.css$/' => 'text/css',
        '/\.png$/' => 'image/png',
        '/\.jpg$/' => 'image/jpg',
        '/\.js$/' => 'text/javascript',
        '/\.svg$/' => 'image/svg+xml',
    ];

    foreach ($mimeTypes as $regex => $mimeType) {
        if (preg_match($regex, $file)) {
            return $mimeType;
        }
    }
    return 'application/octet-stream';
}


function serveFile($file, $folder)
{
    $filePath = storage_path('spa') . "/$folder/$file";

    if (!file_exists($filePath)) {
        abort(404, 'File not found');
    }
    else {
        return response()->file($filePath,
            ['Content-Type' => getMimeType($filePath)]);
    }
}

Route::prefix('api')->group(function () {
    Route::get('', function () {
         abort(404, 'API not found');
    });

    Route::get('{api_method}', function ($api_method) {
        return response()->json(["status" => "ok", "method"=> $api_method], 200);
    });
});

Route::prefix('admin')->group(function () {
    Route::post('login', function () {
        return "Here goes admin login handler";
    });

    Route::any('login', function () {
        abort(404, 'File not found');
    });

    Route::get('{file?}', function ($file = "index.html") {
        return serveFile($file, "admin");
    });
    Route::get('assets/{file}', function ($file) {
        return serveFile($file, "admin/assets");
    });

});

Route::get('/{file?}', function ($file = "index.html") {
    return serveFile($file, "client");
});
Route::get('/assets/{file}', function ($file) {
    return serveFile($file, "client/assets");
});

