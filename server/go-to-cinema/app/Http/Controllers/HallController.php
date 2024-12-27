<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use stdClass;
use App\Models\UpdatePlacesData;

class HallController extends Controller
{

    public function createHall(Request $request): \Illuminate\Http\JsonResponse
    {
        $name = $request->getContent();

        if (!$this->checkString($name, 1, 20)) {
            return response()->json(["status" => "error", "message" => "Неправильный формат названия зала"], 400);
        }

        if (Hall::getHall($name) !== null) {
            return response()->json(["status" => "error", "message" => "Зал с таким названием уже существует"], 400);
        } else {
            $newHall = new Hall(['name' => $name]);
            $newHall->save();
            return response()->json(["status" => "ok", "hall" => $newHall], 201);
        }
    }

    private function checkString($value, int $min, int $max): bool
    {
        $valueStr = trim($value);
        if (!is_string($value) || strlen($valueStr) < $min || strlen($valueStr) > $max) {
            return false;
        }
        return true;
    }

    private function checkInt($value, int $min, int $max): bool
    {
        if (!is_int($value) || $value < $min || $value >= $max) {
            return false;
        }
        return true;
    }

    public function removeHall(Request $request): \Illuminate\Http\JsonResponse
    {
        $name = $request->getContent();

        if (Hall::getHall($name) === null) {
            return response()->json(["status" => "error", "message" => "Зал с таким названием не существует"], 404);
        } else {
            Hall::deleteHall($name);
            return response()->json(["status" => "ok"], 200);
        }
    }

    public function updatePricesInHall(Request $request): \Illuminate\Http\JsonResponse
    {
        $wrong = ["status" => "error", "message" => "Неправильные данные" ,"data"=>json_decode($request->getContent())];
        $data = json_decode($request->getContent());
        $name = $data->name;
        if (Hall::getHall($name) === null) {
            return response()->json(["status" => "error", "message" => "Зал с таким названием не существует"], 404);
        }

        $vipPrice = $data->vipPrice;
        $standardPrice = $data->standardPrice;
        if(!$this->checkInt($vipPrice, intval(env('MIN_VIP_PRICE')), intval(env('MAX_PRICE')))||
        !$this->checkInt($standardPrice, intval(env('MIN_STANDARD_PRICE')), intval(env('MAX_PRICE')))
        ||$vipPrice <= $standardPrice) {
            return response()->json($wrong, 400);
        }

        Hall::updateHallPrices($name, $vipPrice, $standardPrice);

        return response()->json(["status" => "ok","data"=>json_decode($request->getContent())], 200);
    }


    public function updatePlacesInHall(Request $request): \Illuminate\Http\JsonResponse
    {
        $wrong = ["status" => "error", "message" => "Неправильные данные" ,"data"=>json_decode($request->getContent())];

        try {
            $data = UpdatePlacesData::FromStdClass(json_decode($request->getContent(), false));
        } catch (\Exception $e) {
            return response()->json(["status" => "error", "message" => $e->getMessage()], 400);
        }

        if (Hall::getHall($data->name) === null) {
            return response()->json(["status" => "error", "message" => "Зал с таким названием не существует"], 404);
        }

        if (!$this->checkInt($data->rowCount, intval(env('MIN_ROWS_IN_HALL')), intval(env('MAX_ROWS_IN_HALL'))) ||
            !$this->checkInt($data->placesInRow, intval(env('MIN_PLACES_IN_ROW')), intval(env('MAX_PLACES_IN_ROW')))) {
            return response()->json($wrong, 400);
        }

        $disabled = $data->places->disabled;
        foreach ($disabled as $place) {
            if (!$place ||
                !$this->checkInt($place->row, 0, $data->rowCount) ||
                !$this->checkInt($place->place, 0, $data->placesInRow)) {
                return response()->json($wrong, 400);
            }
        }

        Hall::updateHallPlaces($data->name, json_encode($data->places->ToStdClass()), $data->rowCount, $data->placesInRow);

        return response()->json(["status" => "ok"], 200);
    }

    public function getHallsList(): \Illuminate\Http\JsonResponse
    {
        $halls = Hall::all();

        //$halls = array_map(function ($dbhall) { return MakeHallDataFromDb($dbhall); }, $dbhalls);

        return response()->json(["status" => "ok", "data" => $halls], 200);
    }

    public function getHallByName(string $name): \Illuminate\Http\JsonResponse
    {
        $hall = Hall::getHall($name);
        if ($hall === null) {
            return response()->json(["status" => "error", "message" => "Зал с таким названием не существует"], 400);
        }
        $places = json_decode($hall->places);
        $hall->places = $places;
        return response()->json(["status" => "ok", "data" => $hall], 200);
    }
}
