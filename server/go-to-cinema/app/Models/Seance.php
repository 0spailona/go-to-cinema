<?php

namespace App\Models;

use DateInterval;
use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Seance extends Model
{
    use HasFactory;

    protected $table = 'seances';
    protected string $id;
    protected string $movieID;
    protected string $hallId;
    protected string $startTime;
    protected $fillable = [
        'id',
        'movieId',
        'startTime',
        'hallId',
    ];

    static function getSeancesByDate($date): \Illuminate\Support\Collection
    {
        $dateStart = DateTime::createFromFormat(DATE_FORMAT, $date);
        $dateEnd = clone $dateStart;
        $dateEnd->add(new DateInterval('P1D'));

        return DB::table('seances')->where('startTime', '>=', $dateStart)->where('startTime', '<=', $dateEnd)->get();
        //return DB::table('seances')->whereBetween('startTime', [$date,$date+1])->get();
    }

    static function getSeanceById(string $id)
    {
        return DB::table('seances')->where('id', $id)->first();
    }
    static function updateSeance($id,$startTime)
    {
        DB::table('halls')->where('id', $id)->update(['startTime' => $startTime]);
    }
}
