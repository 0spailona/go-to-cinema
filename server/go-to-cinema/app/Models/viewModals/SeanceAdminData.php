<?php

namespace App\Models\viewModals;

use DateTime;

class SeanceAdminData
{
    public string $id;
    public string $movieId;
    public string $hallId;
    public DateTime $startTime;

    static function MakeSeanceAdminDataFromDb($seance): SeanceAdminData
    {
        $startTime = new DateTime($seance->startTime);

        $seanceAdminData = new SeanceAdminData();
        $seanceAdminData->id = $seance->id;
        $seanceAdminData->movieId = $seance->movieId;
        $seanceAdminData->hallId = $seance->hallId;
        $seanceAdminData->startTime = $startTime;

        return $seanceAdminData;
    }
}
