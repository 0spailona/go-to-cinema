<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Movie;
use App\Models\Seance;
use App\Models\viewModals\SeanceAdminData;
use DateInterval;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\ErrorHandler\Debug;
use const DATE_FORMAT;
use const DATE_FORMAT as DATE_FORMAT1;

define('DATE_FORMAT', "Y-m-d\TH:i:sp");


//to Utils


function toDictionary( $enumerable, callable $callback )
{
    $result = [];

    foreach ($enumerable as $value) {
        $result[$callback($value)] = $value;
    }
    return $result;
}



class SeanceController
{

    private function checkSeances(array $seances): bool
    {
        foreach ($seances as $seance) {
            if (Hall::getHallById($seance->hallId) === null
                || Movie::getMovie($seance->movieId) === null) {
                return false;
            }
        }
        return true;
    }

    public function updateSeances(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = json_decode($request->getContent());

        if (!$this->checkSeances($data->seances)) {
            return response()->json(["status" => "error", "message" => "Неверные данные"], 404);
        }
        $date = DateTime::createFromFormat(DATE_FORMAT, $data->date);

        $dateEnd = clone $date;
        $dateEnd->add(new DateInterval('P1D'));
        // make ISOStrings
        $dateStartStr = $date->format(DATE_FORMAT1);
        $dateEndStr = $dateEnd->format(DATE_FORMAT1);

        $seancesInDb = Seance::where('startTime', '>=', $dateStartStr)
            ->where('startTime', '<', $dateEndStr)
            ->get();
        $seancesInDbById = toDictionary($seancesInDb, function ($x) { return $x->id; });

        $seancesToCreate = array_filter($data->seances, function ($x) { return $x->id === null; }); // TODO: support if `id` is absent

        $seancesToUpdate = array_filter($data->seances, function ($x) { return $x->id != null; }); // TODO: support if `id` is absent
        $seancesToUpdateById = toDictionary($seancesToUpdate, function ($x) { return $x->id; });

        $seanceIdsToDelete = array_diff(array_keys($seancesInDbById), array_keys($seancesToUpdateById));

        //DB::beginTransaction();

        // delete
        // create
        // update

        // commit transaction


        foreach ($data->seances as $seance) {
            $seancesForRemove = [...$seancesInDb];
            foreach ($seancesInDb as $lastSeance) {
                if ($lastSeance->id === $seance->id) {
                    $key = array_search($seance->id, $seancesForRemove);
                    if ($key !== false) {
                        unset($seancesForRemove[$key]);
                    }
                }
            }
            $startTime = DateTime::createFromFormat(DATE_FORMAT, $seance->startTime);
            if ($seance->id !== null) {
                Seance::updateSeance($seance->id, $startTime);
            }
            else {
                $seanceModel = Seance::hydrate((array)$seance);
                $seanceModel->id = uniqid();
                $seanceModel->create();


                /*
                Seance::createSeance($seance->movieId, $seance->hallId, $startTime);
                /*$newSeance = new Seance(['id' => uniqid(),
                    'startTime' => $startTime,
                    'hallId' => $seance->hallId,
                    'movieId' => $seance->movieId]);
                $newSeance->save();*/
            }
        }

        return response()->json(["status" => "ok", "date" => $data->date, "seances" => json_decode($request->getContent())], 200);
    }

    /* public function createSeance(Request $request): \Illuminate\Http\JsonResponse
     {
         $data = json_decode($request->getContent());

         return response()->json(["status" => "ok", "movie create" => json_decode($request->getContent())], 201);
     }*/

    public function getSeancesByDate(Request $request): \Illuminate\Http\JsonResponse
    {
        $dateStart = DateTime::createFromFormat(DATE_FORMAT, $request->query('date'));
        $dateEnd = clone $dateStart;
        $dateEnd->add(new DateInterval('P1D'));
        // make ISOStrings
       // $dateStartStr = $dateStart->format(DATE_FORMAT);
        //$dateEndStr = $dateEnd->format(DATE_FORMAT);

        $seances = Seance::select()
            ->where('startTime', '>=', $dateStart->format(DATE_FORMAT)) // Laravel and SQLite
            ->where('startTime', '<', $dateEnd->format(DATE_FORMAT)) // Laravel and SQLite
            ->get();

        $query = Seance::select()
            ->where('startTime', '>=', $dateStart)
            ->where('startTime', '<', $dateEnd);

        Log::debug($query->toSql());
        Log::debug(json_encode($query->getBindings()));

        $seancesData = $seances->toArray();
        /*$seancesData = $seances->map(function ($seance) {
            return SeanceAdminData::MakeSeanceAdminDataFromDb($seance);
        });*/
        $halls = HallController::getHallNamesAndIds();

        return response()->json([
            "status" => "ok",
            "dateStart" => $dateStart->format(DATE_FORMAT),
            "halls" => $halls,
            //"req" => $request->query('date'),
            //"seancesData" => $seancesData,
            "seances" => $seancesData,
        ], 200);
    }

}
