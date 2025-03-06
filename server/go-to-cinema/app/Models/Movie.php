<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;

    protected $table = 'movies';
    protected string $id;
    protected string $title;
    protected string $country;
    protected int $duration = 0;
    protected string $description;
    protected int $release_year ;
    protected string $poster ;
    protected $fillable = [
        'id',
        'title',
        'country',
        'duration',
        'description',
        'release_year',
        'poster',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected $dateFormat = DATE_FORMAT;
    public $incrementing = false;

    // In Laravel 6.0+ make sure to also set $keyType
    protected $keyType = 'string';


    static function getMovie($id)
    {
        return self::where('id', $id)->first();
    }

    static function deleteMovie($id)
    {
        self::where('id', $id)->delete();
    }

    protected function serializeDate(DateTimeInterface $date) : string
    {
        return $date->format(DATE_FORMAT);
    }
}
