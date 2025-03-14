<?php

namespace App\Models;

use DateTime;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


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

    protected $dateFormat = DATE_FORMAT;
    protected $dates = ['startTime'];

    public $incrementing = false;

    // In Laravel 6.0+ make sure to also set $keyType
    protected $keyType = 'string';

    protected function serializeDate(DateTimeInterface $date) : string
    {
        return $date->format(DATE_FORMAT);
    }

    static function byId(string $id) : ?Seance
    {
        return self::where('id', $id)->first();
    }

}
