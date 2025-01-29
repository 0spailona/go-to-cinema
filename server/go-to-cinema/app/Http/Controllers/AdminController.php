<?php

namespace App\Http\Controllers;

use App\Models\Admin;

class AdminController
{
    public function showLoginPage()
    {

        return view('loginPage');
    }

}
