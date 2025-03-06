<?php

namespace App\Models\utils;

use stdClass;

class HallConfig
{
    public static function getHallConfig(): stdClass
    {
        if (is_null(self::$hallConfig)) {
            $data = new stdClass();
            $data->hallNameLength = new stdClass();
            $data->rowsCount = new stdClass();
            $data->placesInRow = new stdClass();
            $data->hallNameLength->min = intval(env('MIN_HALL_NAME_LENGTH'));
            $data->hallNameLength->max = intval(env('MAX_HALL_NAME_LENGTH'));
            $data->rowsCount->min = intval(env('MIN_ROWS_IN_HALL'));
            $data->rowsCount->max = intval(env('MAX_ROWS_IN_HALL'));
            $data->placesInRow->min = intval(env('MIN_PLACES_IN_ROW'));
            $data->placesInRow->max = intval(env('MAX_PLACES_IN_ROW'));
            $data->minVipPrice = intval(env('MIN_VIP_PRICE'));
            $data->maxPrice = intval(env('MAX_PRICE'));
            $data->minStandardPrice = intval(env('MIN_STANDARD_PRICE'));

            self::$hallConfig = $data;
        }
        return self::$hallConfig;
    }

    private static ?\stdClass $hallConfig = null;
}
