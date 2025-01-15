<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
use HasFactory;

protected $table = 'tickets';
    protected string $id;
    protected string $seanceId;
    protected int $row;
    protected int $place;
    protected DateTime $startTime;

protected $fillable = ['row','place','seanceId','startTime'];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    protected $dateFormat = DATE_FORMAT;
    protected $dates = ['startTime'];

    public $incrementing = false;

    // In Laravel 6.0+ make sure to also set $keyType
    protected $keyType = 'string';
}
