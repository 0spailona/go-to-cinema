<?php

namespace App\Models\viewModals;

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
