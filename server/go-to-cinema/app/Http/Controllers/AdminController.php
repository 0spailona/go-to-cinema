<?php

namespace App\Http\Controllers;

use App\Models\Sails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use function Psy\debug;

class AdminController
{
    private function toLogin(): void
    {
        redirect()->action([AdminController::class, 'showLoginPage']);
    }

    public function authorization(Request $request)
    {
        Log::debug("authorization");

        $data = $request->request->all();
        Log::debug(json_encode($data));

        if ($data['email'] != env('ADMIN_MAIL') && $data['password'] != env('ADMIN_PASSWORD')) {
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
        return redirect('http://localhost:3002');
    }

    public function logout(Request $request)
    {
        if (ValidationUtils::checkAdminRights()) {
            $sails = Sails::all();
            $sails[0]->update(['sessionId' => null]);

        }
        $this->toLogin();
    }

    public function showLoginPage()
    {
        Log::debug("showLoginPage");
        return view('loginPage');
    }

    public function isAdmin(): \Illuminate\Http\JsonResponse
    {
        Log::debug("isAdmin");
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

        //$str = json_encode($sails[0]->isOpen);
        //Log::debug($str);
        if ($sails->isEmpty() || !$sails[0]->isOpenSails) {
            return response()->json(["status" => "ok", "data" => false]);
        }

        return response()->json(["status" => "ok", "data" => true]);
    }

    public function toCloseSails(): ?\Illuminate\Http\JsonResponse
    {
        if (!ValidationUtils::checkAdminRights()) {
            $this->toLogin();
        } else {
            $sessionId = session()->getId();

            $sails = Sails::all();

            if ($sails->isEmpty()) {
                Sails::create(['sessionId' => $sessionId, 'isOpenSails' => false]);
                //return response()->json(["status" => "error", "message" => "Продажи закрыты другим администратором. Попробуйте позже"], 400, [], JSON_UNESCAPED_UNICODE);
            } else if ($sails[0]->isOpenSails) {
                $sails[0]->update(['isOpenSails' => false]);
            }

            //$sails2 = json_encode(Sails::all()[0]->isOpenSails);

            //Log::debug($sails2);
            return response()->json(["status" => "ok"]);
        }
        return null;
    }

    public function toOpenSails(): ?\Illuminate\Http\JsonResponse
    {
        if (!ValidationUtils::checkAdminRights()) {
            $this->toLogin();
        } else {
            $sails = Sails::all();
            Log::debug($sails[0]->isOpenSails);
            $sails[0]->update(['isOpenSails' => true]);
            Log::debug("toOpenSails");
            Log::debug($sails[0]->isOpenSails);
            return response()->json(["status" => "ok"]);
        }
        return null;
    }
}
