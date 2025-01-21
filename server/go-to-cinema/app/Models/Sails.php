<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sails extends Model
{
    use HasFactory;

    protected $table = 'sails';
    protected $isOpen;
    protected $sessionId;

    protected $fillable = ['isOpen', 'sessionId'];
}
