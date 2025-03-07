<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\utils\HallConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HallController extends Controller
{
    private \stdClass $hallConfig;

    public function __construct()
    {
        $this->hallConfig = HallConfig::getHallConfig();
    }

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

        $data = json_decode($request->getContent());
        $id = $data->id;
        $hallToUpdate = Hall::byId($id);
        if ($hallToUpdate === null) {
            return response()->json(["status" => "error", "message" => "Зал с таким названием не существует"], 400, [], JSON_UNESCAPED_UNICODE);
        }

        $vipPrice = $data->vipPrice;
        $standardPrice = $data->standardPrice;
        if (!ValidationUtils::checkInt($vipPrice, $this->hallConfig->minVipPrice, $this->hallConfig->maxPrice)) {

            return response()->json(["status" => "error",
                "message" => "Цена вип места должна быть в диапазоне от {$this->hallConfig->minVipPrice} до {$this->hallConfig->maxPrice}",
                "data" => json_decode($request->getContent())], 400, [], JSON_UNESCAPED_UNICODE);
        }

        if (!ValidationUtils::checkInt($standardPrice, $this->hallConfig->minStandardPrice, $this->hallConfig->maxPrice)) {
            return response()->json(["status" => "error",
                "message" => "Цена места должна быть в диапазоне от {$this->hallConfig->minStandardPrice} до {$this->hallConfig->maxPrice}",
                "data" => json_decode($request->getContent())], 400, [], JSON_UNESCAPED_UNICODE);
        }

        if ($vipPrice <= $standardPrice) {
            return response()->json(["status" => "error",
                "message" => "Цена за стандартное место не может быть больше, чем за вип место",
                "data" => json_decode($request->getContent())], 400, [], JSON_UNESCAPED_UNICODE);
        }

        $hallToUpdate->update(['vipPrice' => $vipPrice, 'standardPrice' => $standardPrice]);

        return response()->json(["status" => "ok", "data" => json_decode($request->getContent())]);

    }

private function checkPlacesInHall($places,$hallData){
    foreach ($places as $place) {
        if (!$place) {
            Log::debug("updatePlacesInHall disabled");
            return "Отсутствуют данные о месте";
        }
        if (!ValidationUtils::checkInt($place->row, 0, $hallData->rowsCount)) {
            Log::debug("updatePlacesInHall disabled");
            return "Неверные данные места: места с таким номером не существует";
        }
        if (!ValidationUtils::checkInt($place->place, 0, $hallData->placesInRow)) {
            Log::debug("updatePlacesInHall disabled");
            return "Неверные данные места: места с таким номером не существует";
        }
    }
    return null;
}

    public function updatePlacesInHall(Request $request): \Illuminate\Http\JsonResponse
    {
        if (!ValidationUtils::checkAdminRights()) {
            return response()->json(["status" => "error", "message" => "Not authorized"], 401, [], JSON_UNESCAPED_UNICODE);
        }

        $data = json_decode($request->getContent());

        $id = $data->id;
        if (!$id || !is_string($id) || !$data->places || !is_array($data->places->vip) || !is_array($data->places->disabled)) {
            return response()->json(["status" => "error", "message" => "Отсутствует часть данных",
                "data" => json_decode($request->getContent())], 400, [], JSON_UNESCAPED_UNICODE);
        }
        $hallToUpdate = Hall::byId($id);
        if ($hallToUpdate === null) {
            return response()->json(["status" => "error", "message" => "Зал с таким названием не существует"], 404, [], JSON_UNESCAPED_UNICODE);
        }

        if (!ValidationUtils::checkInt($data->rowsCount, $this->hallConfig->rowsCount->min, $this->hallConfig->rowsCount->max)) {
            Log::debug("updatePlacesInHall rowCount placesInRow");
            return response()->json(["status" => "error",
                "message" => "Количество рядов должно быть в диапазоне от {$this->hallConfig->rowsCount->min} до {$this->hallConfig->rowsCount->max}",
                "data" => json_decode($request->getContent())], 400, [], JSON_UNESCAPED_UNICODE);
        }

        if (!ValidationUtils::checkInt($data->placesInRow, $this->hallConfig->placesInRow->min, $this->hallConfig->placesInRow->max)) {
            Log::debug("updatePlacesInHall rowCount placesInRow");
            return response()->json(["status" => "error",
                "message" => "Количество мест в ряду должно быть в диапазоне от {$this->hallConfig->placesInRow->min} до {$this->hallConfig->placesInRow->max}",
                "data" => json_decode($request->getContent())], 400, [], JSON_UNESCAPED_UNICODE);
        }

        $disabled = $data->places->disabled;
        $mistakeMsg = $this->checkPlacesInHall($disabled,$data);
        if($mistakeMsg !== null) {
            return response()->json(["status" => "error",
                "message" => $mistakeMsg,
                "data" => json_decode($request->getContent())], 400, [], JSON_UNESCAPED_UNICODE);
        }

        $vip = $data->places->vip;
        $mistakeMsg = $this->checkPlacesInHall($vip,$data);
        if($mistakeMsg !== null) {
            return response()->json(["status" => "error",
                "message" => $mistakeMsg,
                "data" => json_decode($request->getContent())], 400, [], JSON_UNESCAPED_UNICODE);
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
