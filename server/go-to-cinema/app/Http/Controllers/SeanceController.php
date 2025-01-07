<?php

namespace App\Http\Controllers;

use App\Models\Seance;
use DateTime;
use Illuminate\Http\Request;

class SeanceController
{
    private function checkValidNewSeance(string $start, int $duration, string $hallId): bool
    {
        return true;
    }

    public function createSeance(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = json_decode($request->getContent());

        return response()->json(["status" => "ok", "movie create" => json_decode($request->getContent())], 201);
    }

    public function getSeancesByDate(Request $request): \Illuminate\Http\JsonResponse
    {
        $dateStart = DateTime::createFromFormat("Y-m-d\TH:i:sP", $request->query('date'));
        $dateEnd = date_add($dateStart, date_interval_create_from_date_string("1 days"));

        $seances = Seance::getSeancesByDate($dateStart, $dateEnd);
        $halls = HallController::getHallNames();
        // $date = json_decode($request->getContent());
        // $seances = Seance::getSeancesByDate($date);
        return response()->json(["status" => "ok", "date" => $dateStart,"halls"=>$halls, "req" => $request->query('date'), "seances" => $seances], 200);
    }

}
