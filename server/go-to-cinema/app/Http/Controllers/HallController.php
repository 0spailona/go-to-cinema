<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HallController extends Controller
{

    public function createHall(Request $request): \Illuminate\Http\JsonResponse
    {
        if (!ValidationUtils::checkAdminRights()) {
            return response()->json(["status" => "error", "message" => "Not authorized"], 401, [], JSON_UNESCAPED_UNICODE);
        }

        $name = $request->getContent();

        if (!ValidationUtils::checkString($name, 1, 20)) {
            return response()->json(["status" => "error", "message" => "Неправильный формат названия зала"], 400, [], JSON_UNESCAPED_UNICODE);
        }

        if (Hall::byName($name) !== null) {
            return response()->json(["status" => "error", "message" => "Зал с таким названием уже существует"], 400, [], JSON_UNESCAPED_UNICODE);
        }

        Hall::create(['name' => $name, 'id' => uniqid()]);
        return response()->json(["status" => "ok"], 201);
    }


    public function removeHall(Request $request): \Illuminate\Http\JsonResponse
    {
        if (!ValidationUtils::checkAdminRights()) {
            return response()->json(["status" => "error", "message" => "Not authorized"], 401, [], JSON_UNESCAPED_UNICODE);
        }
        $id = $request->getContent();

        if (Hall::byId($id) === null) {
            return response()->json(["status" => "error", "message" => "Зал с таким названием не существует"], 400, [], JSON_UNESCAPED_UNICODE);
        } else {
            Hall::destroy($id);
            return response()->json(["status" => "ok"]);
        }

    }

    public function updatePricesInHall(Request $request): \Illuminate\Http\JsonResponse
    {
        if (!ValidationUtils::checkAdminRights()) {
            return response()->json(["status" => "error", "message" => "Not authorized"], 401, [], JSON_UNESCAPED_UNICODE);
        }
        $wrong = ["status" => "error", "message" => "Неправильные данные", "data" => json_decode($request->getContent())];

        $data = json_decode($request->getContent());
        $id = $data->id;
        $hallToUpdate = Hall::byId($id);
        if ($hallToUpdate === null) {
            return response()->json(["status" => "error", "message" => "Зал с таким названием не существует"], 400, [], JSON_UNESCAPED_UNICODE);
        }

        $vipPrice = $data->vipPrice;
        $standardPrice = $data->standardPrice;
        if (!ValidationUtils::checkInt($vipPrice, intval(env('MIN_VIP_PRICE')), intval(env('MAX_PRICE'))) ||
            !ValidationUtils::checkInt($standardPrice, intval(env('MIN_STANDARD_PRICE')), intval(env('MAX_PRICE')))
            || $vipPrice <= $standardPrice) {
            return response()->json($wrong, 400, [], JSON_UNESCAPED_UNICODE);
        }
        $hallToUpdate->update(['vipPrice' => $vipPrice, 'standardPrice' => $standardPrice]);

        return response()->json(["status" => "ok", "data" => json_decode($request->getContent())]);

    }


    public function updatePlacesInHall(Request $request): \Illuminate\Http\JsonResponse
    {
        if (!ValidationUtils::checkAdminRights()) {
            return response()->json(["status" => "error", "message" => "Not authorized"], 401, [], JSON_UNESCAPED_UNICODE);
        }
        $wrong = ["status" => "error", "message" => "Неправильные данные", "data" => json_decode($request->getContent())];

        $data = json_decode($request->getContent());

        $id = $data->id;
        if (!$id || !is_string($id) || !$data->places || !is_array($data->places->vip) || !is_array($data->places->disabled)) {
            return response()->json($wrong, 400, [], JSON_UNESCAPED_UNICODE);
        }
        $hallToUpdate = Hall::byId($id);
        if ($hallToUpdate === null) {
            return response()->json(["status" => "error", "message" => "Зал с таким названием не существует"], 404, [], JSON_UNESCAPED_UNICODE);
        }

        if (!ValidationUtils::checkInt($data->rowsCount, intval(env('MIN_ROWS_IN_HALL')), intval(env('MAX_ROWS_IN_HALL'))) ||
            !ValidationUtils::checkInt($data->placesInRow, intval(env('MIN_PLACES_IN_ROW')), intval(env('MAX_PLACES_IN_ROW')))) {
            Log::debug("updatePlacesInHall rowCount placesInRow");
            return response()->json($wrong, 400, [], JSON_UNESCAPED_UNICODE);
        }

        $disabled = $data->places->disabled;
        foreach ($disabled as $place) {
            if (!$place ||
                !ValidationUtils::checkInt($place->row, 0, $data->rowsCount) ||
                !ValidationUtils::checkInt($place->place, 0, $data->placesInRow)) {
                Log::debug("updatePlacesInHall disabled");
                return response()->json($wrong, 400, [], JSON_UNESCAPED_UNICODE);
            }
        }
        $vip = $data->places->vip;
        foreach ($vip as $place) {

            if (!$place ||
                !ValidationUtils::checkInt($place->row, 0, $data->rowsCount) ||
                !ValidationUtils::checkInt($place->place, 0, $data->placesInRow)) {
                Log::debug("updatePlacesInHall vip");
                return response()->json($wrong, 400, [], JSON_UNESCAPED_UNICODE);
            }
        }

        $places = json_encode($data->places);
        $hallToUpdate->update(['places' => $places, 'rowsCount' => $data->rowsCount, 'placesInRow' => $data->placesInRow]);


        return response()->json(["status" => "ok"], 200);

    }

    public function getHallsList(): \Illuminate\Http\JsonResponse
    {
        $halls = Hall::all();
        return response()->json(["status" => "ok", "halls" => $halls], 200);
    }


    public function getHallById(string $id): \Illuminate\Http\JsonResponse
    {
        $hall = Hall::byId($id);
        if ($hall === null) {
            return response()->json(["status" => "error", "message" => "Зал с таким названием не существует"], 400, [], JSON_UNESCAPED_UNICODE);
        }

        return response()->json(["status" => "ok", "data" => $hall]);
    }
}
