<?php

namespace App\Http\Controllers;

use App\Models\Seance;
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
        $date = $request->query('date');
       // $date = json_decode($request->getContent());
       // $seances = Seance::getSeancesByDate($date);
        return response()->json(["status" => "ok", "getSeancesByDate" => $date], 201);
    }

}
