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
    protected $poster = 'poster';

    static function getMovie($title){
        return DB::table('movies')->where('title', $title)->first();
    }

    static function deleteMovie($title)
    {
        DB::table('halls')->where('title', $title)->delete();
    }
}
