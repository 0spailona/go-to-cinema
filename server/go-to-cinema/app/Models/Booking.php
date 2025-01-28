<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
use HasFactory;

protected $table = 'bookings';
    protected string $id;
    protected string $seanceId;
    protected array $places;
   // protected int $row;
    //protected int $place;
    //protected DateTime $startTime;

protected $fillable = ['places','seanceId','id'];

    protected $hidden = [
        'created_at', 'updated_at'
    ];


    public $incrementing = false;

    // In Laravel 6.0+ make sure to also set $keyType
    protected $keyType = 'string';

    static function byId(string $id) : ?Booking
    {
        return self::where('id', $id)->first();
    }
}
