<?php

namespace App\Http\Controllers;


class ValidationUtils
{
    public static function checkString($value, int $minLen, int $maxLen): bool
    {
        $valueStr = trim($value);
        if (!is_string($value) || strlen($valueStr) < $minLen || strlen($valueStr) > $maxLen) {
            return false;
        }
        return true;
    }

    public static function checkInt($value, int $min, int $max): bool
    {
        if (!is_int($value) || $value < $min || $value >= $max) {
            return false;
        }
        return true;
    }
}
