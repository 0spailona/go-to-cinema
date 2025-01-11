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
    protected string $movieId;
    protected string $hallId;
    protected DateTime $startTime;
    protected $fillable = [
        'id',
        'movieId',
        'startTime',
        'hallId',
    ];


    static function getSeancesByDate(DateTime $dateStart): \Illuminate\Support\Collection
    {
        $dateEnd = clone $dateStart;
        $dateEnd->add(new DateInterval('P1D'));

        return DB::table('seances')
            ->where('startTime', '>=', $dateStart)
            ->where('startTime', '<', $dateEnd)
            ->get();

    }

    static function getSeanceById(string $id)
    {
        return DB::table('seances')->where('id', $id)->first();
    }
    static function updateSeance($id,$startTime)
    {
        DB::table('seances')->where('id', $id)->update(['startTime' => $startTime]);
    }
}
