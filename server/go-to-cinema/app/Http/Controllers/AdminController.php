<?php

namespace App\Http\Controllers;

use App\Models\Sails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminController
{
    public function login(Request $request)
    {
        $data = $request->request->all();

        if ($data['email'] != env('ADMIN_MAIL') && password_hash($data['password'], PASSWORD_DEFAULT) != env('ADMIN_PASSWORD')) {
            return redirect()->action([AdminController::class, 'showLoginPage']);
        } else {
            $sessionId = session()->getId();
            $sails = Sails::all();
            if (count($sails) === 0) {
                Sails::create(['sessionId' => $sessionId, 'isOpenSails' => true]);
            } else {
                $sails[0]->update(['sessionId' => $sessionId]);
            }
        }
        return redirect('/admin');
    }

    public function logout(Request $request)
    {
        if (ValidationUtils::checkAdminRights()) {
            $sails = Sails::all();
            $sails[0]->update(['sessionId' => null]);
        }
        return redirect('/login');
    }

    public function showLoginPage()
    {
        return view('loginPage');
    }

    public function isAdmin(): \Illuminate\Http\JsonResponse
    {
        if (!ValidationUtils::checkAdminRights()) {
            Log::debug("to login");
            return response()->json(['status' => 'ok', 'isAdmin' => false]);
        } else {
            return response()->json(['status' => 'ok', 'isAdmin' => true]);
        }
    }

    public function isOpenSails(): \Illuminate\Http\JsonResponse
    {
        $sails = Sails::all();

        if ($sails->isEmpty() || !$sails[0]->isOpenSails) {
            return response()->json(["status" => "ok", "data" => false]);
        }

        return response()->json(["status" => "ok", "data" => true]);
    }

    public function toCloseSails(): \Illuminate\Http\JsonResponse
    {
        if (!ValidationUtils::checkAdminRights()) {
            return response()->json(["status" => "error", "message" => "Not authorized"], 401, [], JSON_UNESCAPED_UNICODE);
        }
        $sessionId = session()->getId();

        $sails = Sails::all();

        if ($sails->isEmpty()) {
            Sails::create(['sessionId' => $sessionId, 'isOpenSails' => false]);
        } else if ($sails[0]->isOpenSails) {
            $sails[0]->update(['isOpenSails' => false]);
        }

        return response()->json(["status" => "ok"]);
    }

    public function toOpenSails(): \Illuminate\Http\JsonResponse
    {
        if (!ValidationUtils::checkAdminRights()) {
            return response()->json(["status" => "error", "message" => "Not authorized"], 401, [], JSON_UNESCAPED_UNICODE);
        }
        $sails = Sails::all();
        $sails[0]->update(['isOpenSails' => true]);
        return response()->json(["status" => "ok"]);
    }
}
