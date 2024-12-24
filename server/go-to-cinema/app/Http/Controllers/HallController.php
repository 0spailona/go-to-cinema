<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use stdClass;

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
            return response()->json(["status" => "error", "message" => "Зал с таким названием не существует"], 400);
        } else {
            Hall::deleteHall($name);
            return response()->json(["status" => "ok"], 201);
        }

    }

    public function updatePlacesInHall(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = json_decode($request->getContent(), false);
        $places = new stdClass();
        $places->disabled = $data->places->disabled;;
        $places->vip = $data->places->vip;
        Hall::updateHallPlaces($data->hallName,json_encode($places),$data->rowCount,$data->placesInRow);

        return response()->json(["status" => "ok","data"=>$data], 201);
    }

    public function getHallsList(): \Illuminate\Http\JsonResponse
    {
        $halls = Hall::all();

        return response()->json(["status" => "ok", "data" => $halls], 200);
    }

    public function getHallById()
    {

    }
}
