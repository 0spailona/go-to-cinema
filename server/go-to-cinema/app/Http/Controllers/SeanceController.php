<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Movie;
use App\Models\Seance;
use DateInterval;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\ErrorHandler\Debug;
use const DATE_FORMAT;
use const DATE_FORMAT as DATE_FORMAT1;

define('DATE_FORMAT', "Y-m-d\TH:i:sp");


//to Utils


function toDictionary($enumerable, callable $callback)
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
            if(!is_string($seance->hallId) || Hall::byId($seance->hallId) === null){
                return false;
            }
            if(!isset($seance->movieId)){
                break;
            }

            if( is_string($seance->movieId) && Movie::getMovie($seance->movieId) === null)
           {
               return false;
           }
        }
        return true;
    }

    public function updateSeances(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = json_decode($request->getContent());

        //Log::debug($request->getContent());

        if (!$this->checkSeances($data->seances)) {
            return response()->json(["status" => "error", "message" => "Неверные данные"], 404,[],JSON_UNESCAPED_UNICODE);
        }
        $date = DateTime::createFromFormat(DATE_FORMAT, $data->date);

        $seancesInDb = $this->getListByDate($date);

        //Log::debug("seancesInDb: $seancesInDb");

        $seancesInDbById = toDictionary($seancesInDb, function ($x) { return $x->id; });

        $seancesToCreate = array_filter($data->seances, function ($x) { return !isset($x->id); });

        $str = json_encode($seancesToCreate);
       // Log::debug("seancesToCreate: $str");

        $seancesToUpdate = array_filter($data->seances, function ($x) { return isset($x->id); });

        $str2 = json_encode($seancesToUpdate);
        //Log::debug("seancesToUpdate: $str2");

        $seancesToUpdateById = toDictionary($seancesToUpdate, function ($x) { return $x->id; });

        $seanceIdsToDelete = array_diff(array_keys($seancesInDbById), array_keys($seancesToUpdateById));

        $str3 = json_encode($seanceIdsToDelete);
       // Log::debug("seanceIdsToDelete: $str3");

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
        $debug = json_encode($dateStart);
        //Log::debug("getSeancesByDateToClient dateStart: $debug");
        $seances = $this->getListByDate($dateStart)->toArray();
        $debug2 = json_encode($seances);
        //Log::debug("getSeancesByDateToClient dateStart: $debug2");

        return response()->json([
            "status" => "ok",
            "dateStart" => $dateStart->format(DATE_FORMAT),
            "seances" => $seances,
        ]);
    }


    public function getSeancesByDateToAdmin(Request $request): \Illuminate\Http\JsonResponse
    {
        $dateStart = DateTime::createFromFormat(DATE_FORMAT, $request->query('date'));
        $debug1 = json_encode($dateStart);
        Log::debug("getSeancesByDateToAdmin dateStart: $debug1");

        $seances = $this->getListByDate($dateStart)->toArray();
        $debug2 = json_encode($seances);
        Log::debug("getSeancesByDateToAdmin dateStart: $debug2");
        //$halls = HallController::getHallNamesAndIds();

        return response()->json([
            "status" => "ok",
            "dateStart" => $dateStart->format(DATE_FORMAT),
            //"halls" => $halls,
            //"req" => $request->query('date'),
            //"seancesData" => $seancesData,
            "seances" => $seances,
        ]);
    }

    public function getSeanceById(string $id): \Illuminate\Http\JsonResponse
    {
        //$id = $request->query('id');
        Log::debug("getSeanceById: id: $id");
        $seance = Seance::byId($id);
        if($seance === null) {
            return response()->json(["status" => "error"],404);
        }
        return response()->json(["status" => "ok", "seance" => $seance]);
    }

}
