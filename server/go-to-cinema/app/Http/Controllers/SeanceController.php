<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Hall;
use App\Models\Movie;
use App\Models\Seance;
use DateInterval;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use stdClass;
use const DATE_FORMAT;

define('DATE_FORMAT', "Y-m-d\TH:i:sp");


class SeanceController
{

    private function checkSeances(array $seances): bool
    {
        foreach ($seances as $seance) {
            if (!is_string($seance->hallId) || Hall::byId($seance->hallId) === null) {
                return false;
            }
            if (!isset($seance->movieId)) {
                break;
            }

            if (is_string($seance->movieId) && Movie::getMovie($seance->movieId) === null) {
                return false;
            }
        }
        return true;
    }

    public function updateSeances(Request $request): \Illuminate\Http\JsonResponse
    {
        if (!ValidationUtils::checkAdminRights()) {
            return response()->json(["status" => "error", "message" => "Not authorized"], 401, [], JSON_UNESCAPED_UNICODE);
        }
        $data = json_decode($request->getContent());

        if (!$this->checkSeances($data->seances)) {
            return response()->json(["status" => "error", "message" => "Неверные данные"], 404, [], JSON_UNESCAPED_UNICODE);
        }
        $date = DateTime::createFromFormat(DATE_FORMAT, $data->date);

        $seancesInDb = $this->getListByDate($date);

        $seancesInDbById = toDictionary($seancesInDb, function ($x) {
            return $x->id;
        });

        $seancesToCreate = array_filter($data->seances, function ($x) {
            return !isset($x->id);
        });

        $seancesToUpdate = array_filter($data->seances, function ($x) {
            return isset($x->id);
        });

        $seancesToUpdateById = toDictionary($seancesToUpdate, function ($x) {
            return $x->id;
        });

        $seanceIdsToDelete = array_diff(array_keys($seancesInDbById), array_keys($seancesToUpdateById));

        DB::transaction(function () use ($seancesToCreate, $seancesToUpdate, $seanceIdsToDelete) {
            Seance::destroy($seanceIdsToDelete);

            foreach ($seancesToUpdate as $seance) {
                $seanceModel = Seance::byId($seance->id);
                unset ($seance->id);
                $seanceModel->update((array)$seance);
            }

            foreach ($seancesToCreate as $seance) {
                $seance->id = uniqid();
                Seance::create((array)$seance);
            }
        });

        return response()->json(["status" => "ok"]);
    }

    private function getListByDate(DateTime $date)
    {
        $dateEnd = clone $date;
        $dateEnd->add(new DateInterval('P1D'));

        return Seance::select()
            ->where('startTime', '>=', $date->format(DATE_FORMAT)) // Laravel and SQLite
            ->where('startTime', '<', $dateEnd->format(DATE_FORMAT)) // Laravel and SQLite
            ->get();
    }

    public function getSeancesByDateToClient(Request $request): \Illuminate\Http\JsonResponse
    {

        $dateStart = DateTime::createFromFormat(DATE_FORMAT, $request->query('date'));

        $seances = $this->getListByDate($dateStart)->toArray();

        return response()->json([
            "status" => "ok",
            "dateStart" => $dateStart->format(DATE_FORMAT),
            "seances" => $seances,
        ]);
    }


    public function getSeancesByDateToAdmin(Request $request): \Illuminate\Http\JsonResponse
    {
        $dateStart = DateTime::createFromFormat(DATE_FORMAT, $request->query('date'));

        $seances = $this->getListByDate($dateStart)->toArray();

        return response()->json([
            "status" => "ok",
            "dateStart" => $dateStart->format(DATE_FORMAT),
            "seances" => $seances,
        ]);
    }

    public function getSeanceById(string $id): \Illuminate\Http\JsonResponse
    {
        $seance = Seance::byId($id);
        if ($seance === null) {
            return response()->json(["status" => "error"], 404);
        }
        $bookings = Booking::where("seanceId", $seance->id)->get();

        $bookingsArr = $bookings->toArray();
        $allPlaces = array_map(function ($x) {
            $placesOfBooking = json_decode($x['places']);
            return array_map(function ($y) {
                $placeStd = new stdClass();
                $placeStd->row = $y->row;
                $placeStd->place = $y->place;
                return $placeStd;
            }, $placesOfBooking);
        }, $bookingsArr);
        $allPlaces = array_reduce($allPlaces, function ($carry, $item) {
            return array_merge($carry, $item);
        }, []);
        return response()->json(["status" => "ok", "seance" => $seance, "places" => $allPlaces]);
    }

}
