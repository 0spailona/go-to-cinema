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
    public $incrementing = false;

    // In Laravel 6.0+ make sure to also set $keyType
    protected $keyType = 'string';

    
    static function getMovie($id)
    {
        return DB::table('movies')->where('id', $id)->first();
    }

    static function deleteMovie($id)
    {
        DB::table('movies')->where('id', $id)->delete();
    }
}
