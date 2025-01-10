<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Movie;
use App\Models\Seance;
use DateInterval;
use DateTime;
use Illuminate\Http\Request;

define('DATE_FORMAT', "Y-m-d\TH:i:sp");

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

        $lastSeances = Seance::getSeancesByDate($data->date);

        foreach ($data->seances as $seance) {
            $seancesForRemove = [...$lastSeances];
            foreach ($lastSeances as $lastSeance) {
                if ($lastSeance->id === $seance->id) {
                    $key = array_search($seance->id, $seancesForRemove);
                    if ($key !== false) {
                        unset($seancesForRemove[$key]);
                    }
                }
            }

            if (Seance::getSeanceById($seance->id) !== null) {
                Seance::updateSeance($seance->id, $seance->startTime);
            } else {
                $newSeance = new Seance(['id' => uniqid(),
                    'startTime' => $seance->startTime,
                    'hallId' => $seance->hallId,
                    'movieId' => $seance->movieId]);
                $newSeance->save();
            }
        }

        return response()->json(["status" => "ok", "date"=>$data->date, "seances" => json_decode($request->getContent())], 201);
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

        $seances = Seance::getSeancesByDate($request->query('date'));
        //$seances = Seance::all();
        $halls = HallController::getHallNamesAndIds();
        // $date = json_decode($request->getContent());
        // $seances = Seance::getSeancesByDate($date);
        return response()->json([
            "status" => "ok",
            "dateStart" => $dateStart->format(DATE_FORMAT),
            "dateEnd" => $dateEnd->format(DATE_FORMAT),
            "halls" => $halls,
            "req" => $request->query('date'),
            "seances" => $seances
        ], 200);
    }

}
