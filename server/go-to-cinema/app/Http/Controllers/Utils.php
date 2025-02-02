<?php

namespace App\Http\Controllers;
class Utils {
    public static function toDictionary($enumerable, callable $callback): array
    {
        $result = [];

        foreach ($enumerable as $value) {
            $result[$callback($value)] = $value;
        }
        return $result;
    }
}
