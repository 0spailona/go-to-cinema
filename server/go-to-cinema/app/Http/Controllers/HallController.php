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

        if (Hall::getHall($name) !== null) {
            return response()->json(["status" => "error", "message" => "Зал с таким названием уже существует"], 400);
        } else {
            $newHall = new Hall(['name' => $name]);
            $newHall->save();
            return response()->json(["status" => "ok", "hall" => $newHall], 201);
        }
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

    private function checkInt($value, int $min, int $max): bool
    {
        if (!is_int($value) || $value < $min || $value >= $max) {
            return false;
        }
        return true;
    }

    public function updatePlacesInHall(Request $request): \Illuminate\Http\JsonResponse
    {
        $wrong = ["status" => "error", "message" => "Неправильные данные"];

        try {
            $data = UpdatePlacesData::FromStdClass(json_decode($request->getContent(), false));
        }
        catch (\Exception $e) {
           return response()->json(["status" => "error", "message" => $e->getMessage()], 400);
        }

        if (!$this->checkInt($data->rowCount, 5, 20) ||
            !$this->checkInt($data->placesInRow, 5, 20)) {
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
