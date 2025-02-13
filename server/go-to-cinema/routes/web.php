<?php

use Illuminate\Http\Request;
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

function getMimeType($file)
{
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


function serveFile($file, $folder, $defaultFile = null)
{
    $filePath = storage_path('spa') . "/$folder/$file";

    if (!file_exists($filePath)) {
        $filePath = storage_path('spa') . "/$folder/$defaultFile";
    }

    if (!file_exists($filePath)) {
        abort(404, 'File not found');
    } else {
        return response()->file($filePath,
            ['Content-Type' => getMimeType($filePath)]);
    }
}

// global
Route::prefix('showBooking')->group(function () {
    Route::get('{bookingId}', [\App\Http\Controllers\BookingController::class, 'showBooking']);
    Route::get('assets/{file}', function ($file) {
        return serveFile($file, "showBooking");
    });
});

Route::get('getQR/{bookingId}', [\App\Http\Controllers\BookingController::class, 'getQR']);

//login
Route::prefix('login')->group(function () {
    Route::get('', function() {return redirect("/login/form");});
    Route::get('form', [\App\Http\Controllers\AdminController::class, 'showLoginPage']);
    Route::post('', [\App\Http\Controllers\AdminController::class, 'login']);

    //admin SPA
    Route::get('{file}', function ($file) {
        return serveFile($file, "login");
    });
});


// admin
Route::prefix('admin')->group(function () {
    Route::get('', function() {return redirect("/admin/index.html");});
    Route::get('logout', [\App\Http\Controllers\AdminController::class, 'logout']);

    Route::prefix('api')->group(function () {
        Route::get('', function () {
            abort(404, 'API not found');
        });

        Route::get('isAdmin', [\App\Http\Controllers\AdminController::class, 'isAdmin']);

        Route::get('csrf', function (Request $request) {
            return $request->session()->token();
        });


        Route::get('hallConfig', function () {
            $data = new stdClass();
            $data->hallNameLength = new stdClass();
            $data->rowsCount = new stdClass();
            $data->placesInRow = new stdClass();
            $data->hallNameLength->min = intval(env('MIN_HALL_NAME_LENGTH'));
            $data->hallNameLength->max = intval(env('MAX_HALL_NAME_LENGTH'));
            $data->rowsCount->min = intval(env('MIN_ROWS_IN_HALL'));
            $data->rowsCount->max = intval(env('MAX_ROWS_IN_HALL'));
            $data->placesInRow->min = intval(env('MIN_PLACES_IN_ROW'));
            $data->placesInRow->max = intval(env('MAX_PLACES_IN_ROW'));
            $data->minVipPrice = intval(env('MIN_VIP_PRICE'));
            $data->maxPrice = intval(env('MAX_PRICE'));
            $data->minStandardPrice = intval(env('MIN_STANDARD_PRICE'));

            return response
            ()->json(["status" => "ok", "method" => "hallConfig", "hallConfig" => $data], 200);
        });
        Route::get('hallsList', [\App\Http\Controllers\HallController::class, 'getHallsList']);
        Route::get('hall/{id}', [\App\Http\Controllers\HallController::class, 'getHallById']);
        Route::post('newHall', [\App\Http\Controllers\HallController::class, 'createHall']);
        Route::post('removeHall', [\App\Http\Controllers\HallController::class, 'removeHall']);
        Route::post('updatePlacesInHall', [\App\Http\Controllers\HallController::class, 'updatePlacesInHall']);
        Route::post('updatePricesInHall', [\App\Http\Controllers\HallController::class, 'updatePricesInHall']);
        Route::post('newMovie', [\App\Http\Controllers\MovieController::class, 'createMovie']);
        Route::post('removeMovie', [\App\Http\Controllers\MovieController::class, 'removeMovie']);
        Route::get('moviesList', [\App\Http\Controllers\MovieController::class, 'getMoviesList']);
        Route::get('seancesListByDate', [\App\Http\Controllers\SeanceController::class, 'getSeancesByDateToAdmin']);
        Route::post('updateSeances', [\App\Http\Controllers\SeanceController::class, 'updateSeances']);
        Route::get('posterBySession', [\App\Http\Controllers\MovieController::class, 'getPoster']);
        Route::get('posterByMovieId/{movieId}', [\App\Http\Controllers\MovieController::class, 'getPosterByMovieId']);
        Route::post('poster', [\App\Http\Controllers\MovieController::class, 'uploadPoster']);

        Route::post('openSails', [\App\Http\Controllers\AdminController::class, 'toOpenSails']);
        Route::post('closeSails', [\App\Http\Controllers\AdminController::class, 'toCloseSails']);
        Route::get('isOpenSails', [\App\Http\Controllers\AdminController::class, 'isOpenSails']);
    });

    //admin SPA
    Route::get('{file?}', function ($file = "index.html") {
        if (!\App\Http\Controllers\ValidationUtils::checkAdminRights())
        {
            return redirect("/login");
        }
        return serveFile($file, "admin", "index.html");
    });
    Route::get('assets/{file}', function ($file) {
        if (!\App\Http\Controllers\ValidationUtils::checkAdminRights())
        {
            return abort(401, "Access Denied");
        }
        return serveFile($file, "admin/assets");
    });
});

//client api
Route::prefix('api')->group(function () {
    Route::get('', function () {
        abort(404, 'API not found');
    });

    Route::get('csrf', function (Request $request) {
        return $request->session()->token();
    });

    Route::get('seancesListByDate', [\App\Http\Controllers\SeanceController::class, 'getSeancesByDateToClient']);
    Route::get('moviesList', [\App\Http\Controllers\MovieController::class, 'getMoviesList']);
    Route::get('hallsList', [\App\Http\Controllers\HallController::class, 'getHallsList']);
    Route::get('posterByMovieId/{movieId}', [\App\Http\Controllers\MovieController::class, 'getPosterByMovieId']);
    Route::get('seance/{id}', [\App\Http\Controllers\SeanceController::class, 'getSeanceById']);

    Route::get('isOpenSails', [\App\Http\Controllers\AdminController::class, 'isOpenSails']);
    Route::post('toBook', [\App\Http\Controllers\BookingController::class, 'toBook']);


    Route::get('{api_method}', function ($api_method) {
        return response()->json(["status" => "ok", "method" => $api_method], 200);
    });
});

//client SPA
Route::get('{file?}', function ($file = "index.html") {
    return serveFile($file, "client", "index.html");
});

Route::get('hall/{id}', function () {
    return serveFile("index.html", "client");
});

Route::get('ticket/', function () {
    return serveFile("index.html", "client");
});

Route::get('assets/{file}', function ($file) {
    return serveFile($file, "client/assets");
});

Route::get('hall/assets/{file}', function ($file) {
    return serveFile($file, "client/assets");
});

Route::get('ticket/assets/{file}', function ($file) {
    return serveFile($file, "client/assets");
});

