<?php

namespace App\Http\Controllers;

use App\Models\Seance;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController
{
    public function getQR(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = json_decode($request->getContent());

        if(!Seance::byId($data->id)){
            return response()->json(["status" => "error", "message" => "Сеанс не обнаружен"], 404,[],JSON_UNESCAPED_UNICODE);
        }
        else {
            $places = $data->places;
        }
        return response()->json(["status" => "ok", "data" => "getQR"]);
    }

}
