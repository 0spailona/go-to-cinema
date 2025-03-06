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
use Illuminate\Support\Facades\Log;
use stdClass;


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

        //Log::debug("updateSeances " . $request->getContent());

        if (!$this->checkSeances($data->seances)) {
            return response()->json(["status" => "error", "message" => "Неверные данные"], 404, [], JSON_UNESCAPED_UNICODE);
        }
        $dateStart = DateTime::createFromFormat(DATE_FORMAT, $data->date);
        $dateEnd = clone $dateStart;

        $dateEnd->add(new DateInterval('P1D'));
        $seancesInDb = $this->getListByDate($dateStart,$dateEnd);

        $seancesInDbById = Utils::toDictionary($seancesInDb, function ($x) {
            return $x->id;
        });

        $seancesToCreate = array_filter($data->seances, function ($x) {
            return !isset($x->id);
        });

        $seancesToUpdate = array_filter($data->seances, function ($x) {
            return isset($x->id);
        });

        $seancesToUpdateById = Utils::toDictionary($seancesToUpdate, function ($x) {
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

    private function getListByDate(DateTime $dateStart, DateTime  $dateEnd)
    {
        $datePrint = $dateStart->format(DATE_FORMAT);
        $dateEndPrint = $dateEnd->format(DATE_FORMAT);
        Log::debug("date : $datePrint");
        Log::debug("dateEnd: $dateEndPrint");
        return Seance::select()
            ->where('startTime', '>=', $dateStart->format(DATE_FORMAT)) // Laravel and SQLite
            ->where('startTime', '<', $dateEnd->format(DATE_FORMAT)) // Laravel and SQLite
            ->get();
    }

    public function getSeancesByDateToClient(Request $request): \Illuminate\Http\JsonResponse
    {
        Log::debug("getSeancesByDateToClient");
        $dateStart = DateTime::createFromFormat(DATE_FORMAT, $request->query('dateFrom'));

        $dateEnd = DateTime::createFromFormat(DATE_FORMAT, $request->query('dateTo'));

        $seances = $this->getListByDate($dateStart, $dateEnd)->toArray();


        return response()->json([
            "status" => "ok",
            "dateStart" => $dateStart->format(DATE_FORMAT),
            "seances" => $seances,
        ]);
    }


    public function getSeancesByDateToAdmin(Request $request): \Illuminate\Http\JsonResponse
    {
        Log::debug("DATE_FORMAT " . DATE_FORMAT);

        $dateStart = DateTime::createFromFormat(DATE_FORMAT, $request->query('date'));
        $dateEnd = clone $dateStart;
        $dateEnd->add(new DateInterval('P1D'));
        $seances = $this->getListByDate($dateStart,$dateEnd)->toArray();

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
