<?php

namespace App\Http\Controllers;

use App\Models\Sails;
use Illuminate\Support\Facades\Log;

class SailsController
{
    public function isOpenSails(): \Illuminate\Http\JsonResponse
    {
        $sails = Sails::all();

        $str = json_encode($sails[0]->isOpen);
        Log::debug($str);
        if ($sails->isEmpty() || !$sails[0]->isOpen) {
            return response()->json(["status" => "ok", "data" => false]);
        }

        return response()->json(["status" => "ok", "data" => true]);
    }

    public function toCloseSails(): \Illuminate\Http\JsonResponse
    {
        $sessionId = session()->getId();

        $sails = Sails::all();

        if ($sails->isEmpty()) {
            Sails::create(['sessionId' => $sessionId, 'isOpen' => false]);
        } else if (!$sails[0]->isOpen || $sails[0]->sessionId !== $sessionId) {
            return response()->json(["status" => "error", "message" => "Продажи закрыты другим администратором. Попробуйте позже"], 400, [], JSON_UNESCAPED_UNICODE);
        } else if ($sails[0]->isOpen || $sails[0]->sessionId === $sessionId) {
            $sails[0]->update(['isOpen' => false]);
        } else {
            $sails[0]->update(['sessionId' => $sessionId, 'isOpen' => false]);
        }

        //$sails2 = json_encode(Sails::all()[0]->isOpen);

        //Log::debug($sails2);
        return response()->json(["status" => "ok"]);
    }

    public function toOpenSails(): \Illuminate\Http\JsonResponse
    {
        $sails = Sails::all();
        $sails[0]->update(['isOpen' => true]);

        return response()->json(["status" => "ok"]);
    }
}
