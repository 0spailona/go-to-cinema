<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sails extends Model
{
    use HasFactory;

    protected $table = 'sails';
    protected $isOpenSails;
    protected $sessionId;

    protected $fillable = ['isOpenSails', 'sessionId'];
}
