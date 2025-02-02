<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Movie;
use App\Models\Seance;
use App\Models\Booking;
use BaconQrCode\Renderer\GDLibRenderer;
use BaconQrCode\Renderer\Image\ImagickImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use Illuminate\Http\Request;
use Nette\Utils\Arrays;
use BaconQrCode\Writer;

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
                return response()->json(["status" => "error", "message" => "Неверные данные"], 404, [], JSON_UNESCAPED_UNICODE);
            }
            if (count($places) === 0) {
                return response()->json(["status" => "error", "message" => "Не выбрано ни одного места"], 404, [], JSON_UNESCAPED_UNICODE);
            }
            $seance = Seance::byId($data->seanceId);

            $hall = Hall::byId($seance->hallId);

            foreach ($places as $place) {
                if (!$this->validatePlace($place, $hall, $data->seanceId)) {
                    return response()->json(["status" => "error", "message" => "Неверные данные"], 404, [], JSON_UNESCAPED_UNICODE);
                }
            }

            $id = uniqid();
            Booking::create(["seanceId" => $data->seanceId, "places" => json_encode($places), 'id' => $id]);
        }
        return response()->json(["status" => "ok", "data" => $id]);
    }

    private function validatePlace($place, $hall, $seanceId): bool
    {
        if (!$place->row || !$place->place) {
            return false;
        }
        if (!ValidationUtils::checkInt($place->row, 1, $hall->rowsCount)
            || !ValidationUtils::checkInt($place->place, 1, $hall->placesInRow)) {
            return false;
        }

        $takenPlacesOfAllBookings = Booking::where("seanceId", $seanceId)->pluck("places")->toArray();
        foreach ($takenPlacesOfAllBookings as $takenPlaces) {
            $takenPlaces = json_decode($takenPlaces);
            foreach ($takenPlaces as $takenPlace) {
                if ($takenPlace->place === $place->place && $takenPlace->row === $hall->row) {
                    return false;
                }
            }
        }

        $hallPlacesStatus = json_decode($hall->places);

        $status = $place->status;
        if ($status !== "standard" && $status !== "vip") {
            return false;
        }

        $disabledPlaces = Arrays::filter($hallPlacesStatus->disabled, function ($disabledPlace) use ($place) {
            if ($disabledPlace->row === $place->row && $disabledPlace->place === $place->place) {
                return $disabledPlace;
            }
        });

        if (count($disabledPlaces) > 0) {

            return false;
        }

        $vipPlaces = Arrays::filter($hallPlacesStatus->vip, function ($vipPlace) use ($place) {
            return $vipPlace->row === $place->row && $vipPlace->place === $place->place;
        });

        if ($status === "standard" && count($vipPlaces) > 0) {
            return false;
        }

        if ($status === "vip" && count($vipPlaces) === 0) {
            return false;
        }

        return true;
    }

    public function getQR(string $bookingId)
    {
        $renderer = new GDLibRenderer(400);
        $writer = new Writer($renderer);
        $url = env('PUBLIC_URL') . "showBooking/" . $bookingId;
        $qr = $writer->writeString($url);
        return response($qr)->header('Content-Type', 'image/png');
    }

    public function showBooking($id)
    {
        $booking = Booking::byId($id);
        if($booking == null){
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

}
