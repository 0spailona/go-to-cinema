<?php

namespace App\Models\viewModals;

use App\Models\Hall;
use stdClass;

class HallData
{
    public string $id;
    public string $name;
    public int $rowsCount;
    public int $vipPrice;
    public int $standardPrice;
    public int $placesInRow ;
    public PlacesData $places;

    static function GetShortDataInStdClass($hall): stdClass
    {
        $shortInfo = new stdClass();
        $shortInfo->id = $hall->id;
        $shortInfo->name = $hall->name;
        return $shortInfo;
    }
}
