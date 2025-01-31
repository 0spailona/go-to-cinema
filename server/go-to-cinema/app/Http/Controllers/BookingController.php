<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Movie;
use App\Models\Seance;
use App\Models\Booking;
use BaconQrCode\Encoder\Encoder;
use BaconQrCode\Renderer\Image\ImagickImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Nette\Utils\Arrays;
use BaconQrCode\Renderer\GDLibRenderer;
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
            //Log::debug(json_encode($hall));
            foreach ($places as $place) {
                if (!$this->validatePlace($place, $hall)) {
                    return response()->json(["status" => "error", "message" => "Неверные данные"], 404, [], JSON_UNESCAPED_UNICODE);
                }
            }

            $id = uniqid();
            Booking::create(["seanceId" => $data->seanceId, "places" => json_encode($places), 'id' => $id]);
        }
        return response()->json(["status" => "ok", "data" => $id]);
    }

    private function validatePlace($place, $hall): bool
    {
        if (!$place->row || !$place->place) {
            Log::debug("no place");
            return false;
        }
        if (!ValidationUtils::checkInt($place->row, 1, $hall->rowsCount)
            || !ValidationUtils::checkInt($place->place, 1, $hall->placesInRow)) {
            Log::debug("checkInt");
            return false;
        }

        $hallPlacesStatus = json_decode($hall->places);

        $status = $place->status;
        if ($status !== "standard" && $status !== "vip") {
            Log::debug("no status");
            return false;
        }

        $disabledPlaces = Arrays::filter($hallPlacesStatus->disabled, function ($disabledPlace) use ($place) {
            if ($disabledPlace->row === $place->row && $disabledPlace->place === $place->place) {
                return $disabledPlace;
            }
        });

        //Log::debug(json_encode($disabledPlaces,JSON_UNESCAPED_UNICODE));

        if (count($disabledPlaces) > 0) {
            //Log::debug(json_encode($hallPlacesStatus->disabled,JSON_UNESCAPED_UNICODE));
            // Log::debug(json_encode($place,JSON_UNESCAPED_UNICODE));
            Log::debug("disabled place");
            return false;
        }

        $vipPlaces = Arrays::filter($hallPlacesStatus->vip, function ($vipPlace) use ($place) {
            return $vipPlace->row === $place->row && $vipPlace->place === $place->place;
        });

        if ($status === "standard" && count($vipPlaces) > 0) {
            Log::debug("standard as vip");
            return false;
        }

        if ($status === "vip" && count($vipPlaces) === 0) {
            Log::debug("vip place is no vip");
            return false;
        }

        return true;
    }

    public function getQR(string $bookingId)
    {
        Log::debug("getQR");
        $renderer = new ImageRenderer(
            new RendererStyle(400),
            new ImagickImageBackEnd()
        );
        $writer = new Writer($renderer);
        $url = env('PUBLIC_URL') . "showBooking/" . $bookingId;
        $qr = $writer->writeString($url);
        return response($qr)->header('Content-Type', 'image/png');
    }

    public function showBooking($id)
    {
        Log::debug("showBooking $id");

        $booking = Booking::byId($id);
        $seance = Seance::byId($booking->seanceId);
        Log::debug(json_encode($booking));
        if ($booking == null || $seance == null) {
            return view('booking', ['bookingId' => $id, 'error' => true]);
        } else {
            //$seance = Seance::byId($booking->seanceId);
            Log::debug(json_encode($seance));
            $hall = Hall::byId($seance->hallId);
            $movie = Movie::getMovie($seance->movieId);
            $startTime = date('H:i', strtotime($seance->startTime));
            Log::debug($startTime);
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
            $view = $view . " ряд " . $place->row . " место " . $place->place . $separator;
        }
        //Log::debug("view");
        //Log::debug($view);
        return $view;
    }

}
