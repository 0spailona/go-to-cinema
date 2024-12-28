<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Movie extends Model
{
    use HasFactory;

    protected $table = 'movies';
    protected string $id = 'id';
    protected string $title = 'title';
    protected string $country = 'country';
    protected int $duration = 0;
    protected string $description = 'description';
    protected int $release_year = 0;
    protected $poster = 'poster';
    protected $fillable = [
        'id',
        'title',
        'country',
        'duration',
        'description',
        'release_year',
    ];

    static function getMovie($title,$country,$duration,$release_year)
    {
        return DB::table('movies')->where('title', $title)
            ->where('country',$country)
            ->where('duration',$duration)
            ->where('release_year',$release_year)
            ->first();
    }

    static function deleteMovie($title)
    {
        DB::table('halls')->where('title', $title)->delete();
    }
}
