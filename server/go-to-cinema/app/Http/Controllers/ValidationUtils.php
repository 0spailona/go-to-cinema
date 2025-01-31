<?php

namespace App\Http\Controllers;


use App\Models\Sails;
use Illuminate\Support\Facades\Log;

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

    public static function checkAdminRights(): bool
    {
        $sessionId = session()->getId();
        $sails = Sails::all();
        Log::debug("checkAdminRights");
        Log::debug($sessionId);
        //Log::debug($sails[0]->sessionId);
        if ($sails->isEmpty() || $sails[0]->sessionId !== $sessionId) {
            Log::debug("to login");
           return false;
        }
          return true;

    }


}
