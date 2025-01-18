<?php

namespace App\Http\Controllers;

class SailsController
{
    public function isOpen()
    {

    }

    public function toCloseSails()
    {
        response()->json(["status" => "ok"]);
    }

    public function toOpenSails()
    {

        response()->json(["status" => "ok"]);
    }
}
