<?php

namespace App\Http\Controllers;
function toDictionary($enumerable, callable $callback): array
{
    $result = [];

    foreach ($enumerable as $value) {
        $result[$callback($value)] = $value;
    }
    return $result;
}
