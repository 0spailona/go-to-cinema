<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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
}
