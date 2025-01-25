<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Seance;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BookingController
{
    public function getQR(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = json_decode($request->getContent());

        if (!Seance::byId($data->seanceId)) {
            return response()->json(["status" => "error", "message" => "Сеанс не обнаружен"], 404, [], JSON_UNESCAPED_UNICODE);
        } else {
            $places = $data->places;
            if (is_array($places) != "array") {
                return response()->json(["status" => "error", "message" => "Неверные данные"], 404, [], JSON_UNESCAPED_UNICODE);
            }
            if (count($places) === 0) {
                return response()->json(["status" => "error", "message" => "Не выбрано ни одного места"], 404, [], JSON_UNESCAPED_UNICODE);
            }
            $seance = Seance::byId($data->seanceId);

            $hall = Hall::byId($seance->hallId);
            foreach ($places as $place) {
                if (!$this->validatePlace($place, $hall)) {
                    return response()->json(["status" => "error", "message" => "Неверные данные"], 404, [], JSON_UNESCAPED_UNICODE);
                }
            }
            Log::debug(json_encode($places));
            //TODO validation places
            Booking::create(["seanceId" => $data->seanceId, "places" => json_encode($places), 'id' => uniqid()]);
        }
        return response()->json(["status" => "ok", "data" => "getQR"]);
    }

    private function validatePlace($place, $hall): bool
    {
        if (!$place->row || !$place->place) {
            return false;
        }
        if(!ValidationUtils::checkInt($place->row,1,$hall->rowCount)
            ||!ValidationUtils::checkInt($place->place,1,$hall->placesInRow)) {
            return false;
        }

        $hallPlacesStatus = json_decode($hall->places);

        $status = $place->status;
        if($status !== "standard" && $status !== "vip"){
            return false;
        }

        foreach ($hallPlacesStatus->disabled as $disabledPlace) {
            if($disabledPlace->row === $place->row && $disabledPlace->place === $place->place){
                return false;
            }
        }

        foreach ($hallPlacesStatus->vip as $vipPlace) {
            if($place->status === "standard"
            && $vipPlace->row === $place->row && $vipPlace->place === $place->place){
                return false;
            }
        }
        return true;
    }
}
