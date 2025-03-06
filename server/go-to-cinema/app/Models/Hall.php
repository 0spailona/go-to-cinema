<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hall extends Model
{
    use HasFactory;

    protected $table = "halls";
    protected string $id;
    protected string $name;
    protected int $vipPrice;
    protected int $standardPrice;
    protected int $rowCount;
    protected int $placesInRow;
    protected $places;
    protected $fillable = [
        'id',
        'name',
        'places',
        'vipPrice',
        'standardPrice',
        'rowsCount',
        'placesInRow',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    protected $dateFormat = DATE_FORMAT;

    public $incrementing = false;

    // In Laravel 6.0+ make sure to also set $keyType
    protected $keyType = 'string';

    static function byName($name)
    {
        return self::where('name', $name)->first();
    }

    static function byId($id)
    {
        return self::where('id', $id)->first();
    }

    protected function serializeDate(DateTimeInterface $date) : string
    {
        return $date->format(DATE_FORMAT);
    }

}
