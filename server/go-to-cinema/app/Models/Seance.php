<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Seance extends Model
{
    use HasFactory;

    protected $table = 'seances';
    protected string $id;
    protected string $movieID;
    protected string $hallName;
    protected string $startTime;
    protected $fillable = [
        'id',
        'movieID',
        'startTime',
        'hallName',
    ];

    static function getSeancesByDate($dateStart,$dateEnd): \Illuminate\Support\Collection
    {
        return DB::table('seances')->where('startTime', '>=', $dateStart)->where('startTime', '<=', $dateEnd)->get();
        //return DB::table('seances')->whereBetween('startTime', [$date,$date+1])->get();
    }

}
