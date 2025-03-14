<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Movie;
use App\Models\Seance;
use App\Models\Booking;
use BaconQrCode\Renderer\GDLibRenderer;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Nette\Utils\Arrays;
use BaconQrCode\Writer;
use stdClass;
use function Psy\debug;

class BookingController
{
    public function toBook(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = json_decode($request->getContent());

        if (!Seance::byId($data->seanceId)) {
            return response()->json(["status" => "error", "message" => "Сеанс не обнаружен"], 404, [], JSON_UNESCAPED_UNICODE);
        } else {
            $places = $data->places;
            if (is_array($places) != "array") {
                return response()->json(["status" => "error", "message" => "Неверный тип данных"], 404, [], JSON_UNESCAPED_UNICODE);
            }
            if (count($places) === 0) {
                return response()->json(["status" => "error", "message" => "Не выбрано ни одного места"], 404, [], JSON_UNESCAPED_UNICODE);
            }
            $seance = Seance::byId($data->seanceId);

            $now = new DateTime();


            //Log::debug("now " . $now->format(DATE_FORMAT));
            //Log::debug("startTime " . $seance->startTime->format(DATE_FORMAT));

            if ($seance->startTime < $now) {
                return response()->json(["status" => "error", "message" => "На выбранный сеанс уже закрыто бронирование"], 404, [], JSON_UNESCAPED_UNICODE);
            }

            $hall = Hall::byId($seance->hallId);

            foreach ($places as $place) {
                if (!$this->validatePlace($place, $hall, $data->seanceId)) {
                    return response()->json(["status" => "error", "message" => "Неверные данные: бронируемое место не существует"], 404, [], JSON_UNESCAPED_UNICODE);
                }
            }

            $id = uniqid();
            Booking::create(["seanceId" => $data->seanceId, "places" => json_encode($places), 'id' => $id]);
        }
        return response()->json(["status" => "ok", "data" => $id]);
    }

    private function checkPlaceInHall(stdClass $place, Hall $hall) : bool
    {
        if (!ValidationUtils::checkInt($place->row, 0, $hall->rowsCount)
            || !ValidationUtils::checkInt($place->place, 0, $hall->placesInRow)) {
            Log::debug("checkInt");
            return false;
        }

        $disabledPlaces = Arrays::filter(json_decode($hall->places)->disabled, function ($disabledPlace) use ($place) {
            if ($disabledPlace->row === $place->row && $disabledPlace->place === $place->place) {
                return $disabledPlace;
            }
        });

        if (count($disabledPlaces) > 0) {
            Log::debug("count (disabledPlaces) > 0");
            return false;
        }
        return true;
    }

    private function checkPlaceFree(stdClass $place, $seanceId,Hall $hall) : bool
    {
        $takenPlacesOfAllBookings = Booking::where("seanceId", $seanceId)->pluck("places")->toArray();
        $takenPlaceForPrint = json_encode($takenPlacesOfAllBookings);

        Log::debug("takenPlacesOfAllBookings " . $takenPlaceForPrint);

        foreach ($takenPlacesOfAllBookings as $takenPlaces) {
            $takenPlaces = json_decode($takenPlaces);
            foreach ($takenPlaces as $takenPlace) {
                if ($takenPlace->place === $place->place && $takenPlace->row === $hall->row) {
                    return false;
                }
            }
        }
        return true;
    }

    private function validatePlace($place, $hall, $seanceId): bool
    {
        $placeForPrint = json_encode($place);
        Log::debug("placeForPrint " . $placeForPrint);
        if (!$place->row || !$place->place) {
            return false;
        }

        if(!$this->checkPlaceInHall($place, $hall)) {
            return false;
        }

       if(!$this->checkPlaceFree($place, $seanceId,$hall)) {
           return false;
       }

        $hallPlacesStatus = json_decode($hall->places);

        //$validatePlaces = json_encode($hall->places->toArray());
        //Log::debug((array)"hallPlacesStatus : $validatePlaces");

        $status = $place->status;
        if ($status !== "standard" && $status !== "vip") {
            Log::debug("status is not standard or vip" . $status);
            return false;
        }

        $vipPlaces = Arrays::filter($hallPlacesStatus->vip, function ($vipPlace) use ($place) {
            return $vipPlace->row === $place->row && $vipPlace->place === $place->place;
        });

         if ($status === "standard" && count($vipPlaces) > 0) {
             Log::debug("vip as standard");
             return false;
         }

         if ($status === "vip" && count($vipPlaces) === 0) {
             Log::debug("vip is hall without vip");
             return false;
         }

        return true;
    }

    public function getQR(string $bookingId)
    {
        Log::debug("getQR");
        $renderer = new GDLibRenderer(400);
        $writer = new Writer($renderer);
        $url = rtrim(env('PUBLIC_URL'), '/') . "/showBooking/" . $bookingId;
        $qr = $writer->writeString($url);
        return response($qr)->header('Content-Type', 'image/png');
    }

    public function showBooking($id)
    {
        $booking = Booking::byId($id);
        if ($booking == null) {
            abort(404);
        }
        $seance = Seance::byId($booking->seanceId);

        if ($booking == null || $seance == null) {
            return view('booking', ['bookingId' => $id, 'error' => true]);
        } else {
            $hall = Hall::byId($seance->hallId);
            $movie = Movie::getMovie($seance->movieId);
            $startTime = date('H:i', strtotime($seance->startTime));
            $placesString = $this->getPlacesForView(json_decode($booking->places));

            return view('booking', ['bookingId' => $id,
                'hallName' => $hall->name,
                'title' => $movie->title,
                'places' => $placesString,
                'startTime' => $startTime,
                'error' => false]);
        }

    }

    private function getPlacesForView($places): string
    {
        $view = "";
        $count = 0;
        foreach ($places as $place) {
            $separator = "";
            if ($count !== count($places) - 1) {
                $separator = ", ";
            }
            $count++;
            $rowView = $place->row + 1;
            $placeView = $place->place + 1;
            $view = $view . " ряд " . $rowView . " место " . $placeView . $separator;
        }
        return $view;
    }

    public function checkPlaces(Request $request)
    {
        $places = $request->query('places');

        if (preg_match("/^([0-9]{1,2}_[0-9]{1,2},)*[0-9]{1,2}_[0-9]{1,2}$/", $places) != 1) {
            return response()->json(["status" => "error", "message" => "Неверные данные"], 404, [], JSON_UNESCAPED_UNICODE);
        }

        $seanceId = $request->query('seanceId');

        $seance = Seance::byId($seanceId);
        if (!$seance) {
            return response()->json(["status" => "error", "message" => "Сеанс не обнаружен"], 404, [], JSON_UNESCAPED_UNICODE);
        }

        $hall = Hall::byId($seance->hallId);
        if (!$hall) {
            return response()->json(["status" => "error", "message" => "Зал не обнаружен"], 404, [], JSON_UNESCAPED_UNICODE);
        }

        //$hallPlacesStatus = json_decode($hall->places);
        //Log::debug("hallPlacesStatus : " . $hall->places);

        $selectedPlaces = explode(",", $places);

        $selectedPlaces = array_map(function ($place) {
            $place = explode("_", $place);
            $stdPlace = new stdClass();
            $stdPlace->row = intval($place[0]);
            $stdPlace->place = intval($place[1]);
            return $stdPlace;
        }, $selectedPlaces);

        $placesForPrint = json_encode($selectedPlaces);

        //Log::debug("checkPlaces " . $placesForPrint);
        //Log::debug("seanceId " . $seanceId);

        foreach ($selectedPlaces as $place) {
            if(!$this->checkPlaceInHall($place, $hall)) {
                return response()->json(["status" => "error", "message" => "Эти места не доступны для бронирования"], 404, [], JSON_UNESCAPED_UNICODE);
            }
            if(!$this->checkPlaceFree($place,$seanceId,$hall)) {
                return response()->json(["status" => "error", "message" => "Эти места уже забронированы"], 404, [], JSON_UNESCAPED_UNICODE);
            }
        }

        return response()->json(["status" => "success", "data" => $selectedPlaces]);

    }
}
