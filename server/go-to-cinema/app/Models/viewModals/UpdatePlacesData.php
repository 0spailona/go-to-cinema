<?php

namespace App\Models\viewModals;

use stdClass;

class UpdatePlacesData
{
    public string $id;
    public string $name;
    public int $rowCount;
    public int $placesInRow;
    public PlacesData $places;

    public static function FromStdClass(stdClass $data): UpdatePlacesData
    {
        $updatePlacesData = new UpdatePlacesData();

        $updatePlacesData->id = $data->id;
        $updatePlacesData->name = $data->name;
        $updatePlacesData->rowCount = $data->rowCount;
        $updatePlacesData->placesInRow = $data->placesInRow;
        $updatePlacesData->places = PlacesData::FromStdClass($data->places);
        return $updatePlacesData;
    }

    public function ToStdClass(): stdClass
    {
        $stdObject = new stdClass();
        $stdObject->id = $this->id;
        $stdObject->name = $this->name;
        $stdObject->rowCount = $this->rowCount;
        $stdObject->placesInRow = $this->placesInRow;
        $stdObject->places = $this->places->ToStdClass();
        return $stdObject;
    }
}
