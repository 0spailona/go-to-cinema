<?php

namespace App\Models;

use DateInterval;
use DateTime;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use const DATE_FORMAT;

//define('DATE_FORMAT', "Y-m-d\TH:i:sp");

class Seance extends Model
{
    use HasFactory;

    protected $table = 'seances';

    protected string $id;
    protected string $movieId;
    protected string $hallId;
    protected DateTime $startTime;

    protected $fillable = [
        'id',
        'movieId',
        'startTime',
        'hallId',
    ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];
//protected $dateFormat = env('DATE_FORMAT');
    //protected $dateFormat = DATE_FORMAT;
    protected $dates = ['startTime'];

    public $incrementing = false;

    // In Laravel 6.0+ make sure to also set $keyType
    protected $keyType = 'string';

    protected function serializeDate(DateTimeInterface $date) : string
    {
        return $date->format(env('DATE_FORMAT'));
    }

    static function byId(string $id) : ?Seance
    {
        return self::where('id', $id)->first();
    }

}
