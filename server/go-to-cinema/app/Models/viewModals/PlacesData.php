<?php

namespace App\Models\viewModals;

use stdClass;

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
