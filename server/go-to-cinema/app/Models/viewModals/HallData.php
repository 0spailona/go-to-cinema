<?php

namespace App\Models\viewModals;

use App\Models\Hall;
use stdClass;

class HallData
{
    public string $name;
    public int $rowsCount;
    public int $vipPrice;
    public int $standardPrice;
    public int $placesInRow ;
    public PlacesData $places;

    static function MakeHallDataFromDb($hall): HallData
    {
        $placesData = PlacesData::FromStdClass(json_decode($hall->places));
        $hallData = new HallData();
        $hallData->name = $hall->name;
        $hallData->rowsCount = $hall->rowsCount;
        $hallData->placesInRow = $hall->placesInRow;
        $hallData->places = $placesData;
        $hallData->vipPrice = $hall->vipPrice;
        $hallData->standardPrice = $hall->standardPrice;
        return $hallData;
    }
}
