<?php

namespace App\Models;

use stdClass;

class Place {
    public int $row;
    public int $place;
    public static function FromStdClass(stdClass $data) : Place
    {
        $placeData = new Place();
        $placeData->row = $data->row;
        $placeData->place = $data->place;
        return $placeData;
    }

    public function ToStdClass() : stdClass {
        $placeData = new stdClass();
        $placeData->row = $this->row;
        $placeData->place = $this->place;
        return $placeData;
    }
}

class PlacesData
{
    public array $vip;
    public array $disabled;

    public static function FromStdClass(stdClass $data) : PlacesData {
        $placesData = new PlacesData();
        $placesData->vip = array_map(function ($x) { return Place::FromStdClass($x);}, $data->vip );
        $placesData->disabled = array_map(function ($x) { return Place::FromStdClass($x);}, $data->disabled );
        return $placesData;
    }

    public function ToStdClass() : stdClass
    {
        $stdObject = new stdClass();
        $stdObject->vip = array_map(function ($x) { return $x->ToStdClass();}, $this->vip );
        $stdObject->disabled = array_map(function ($x) { return $x->ToStdClass();}, $this->disabled );
        return $stdObject;
    }
}


class UpdatePlacesData
{
    public string $name;
    public int $rowCount;
    public int $placesInRow;
    public PlacesData $places;

    public static function FromStdClass(stdClass $data) : UpdatePlacesData {
        $updatePlacesData = new UpdatePlacesData();

        $updatePlacesData->name = $data->name;
        $updatePlacesData->rowCount = $data->rowCount;
        $updatePlacesData->placesInRow = $data->placesInRow;
        $updatePlacesData->places = PlacesData::FromStdClass($data->places);
        return $updatePlacesData;
    }

    public function ToStdClass() : stdClass {
        $stdObject = new stdClass();
        $stdObject->name = $this->name;
        $stdObject->rowCount = $this->rowCount;
        $stdObject->placesInRow = $this->placesInRow;
        $stdObject->places = $this->places->ToStdClass();
        return $stdObject;
    }
}
