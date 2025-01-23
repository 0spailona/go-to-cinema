<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
use HasFactory;

protected $table = 'tickets';
    protected string $id;
    protected string $seanceId;
    protected array $places;
   // protected int $row;
    //protected int $place;
    //protected DateTime $startTime;

protected $fillable = ['places','seanceId'];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    protected $dateFormat = DATE_FORMAT;
    protected $dates = ['startTime'];

    public $incrementing = false;

    // In Laravel 6.0+ make sure to also set $keyType
    protected $keyType = 'string';
}
