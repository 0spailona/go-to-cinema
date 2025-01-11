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
        $seanceAdminData = new SeanceAdminData();
        $seanceAdminData->id = $seance->id;
        $seanceAdminData->movieId = $seance->movieId;
        $seanceAdminData->hallId = $seance->hallId;
        $seanceAdminData->startTime = $seance->startTime;

        return $seanceAdminData;
    }
}
