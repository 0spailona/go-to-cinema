<?php

namespace App\Models\viewModals;

use Illuminate\Support\Facades\Log;
use stdClass;

class UpdatePlacesData
{
    public string $id;
    public string $name;
    public int $rowCount;
    public int $placesInRow;
   // public PlacesData $places;

    public static function FromStdClass(stdClass $data): UpdatePlacesData
    {

        $updatePlacesData = new UpdatePlacesData();

        $updatePlacesData->id = $data->id;
        $updatePlacesData->rowCount = $data->rowCount;
        $updatePlacesData->placesInRow = $data->placesInRow;
        //$updatePlacesData->places = PlacesData::FromStdClass($data->places);

        return $updatePlacesData;
    }

}
