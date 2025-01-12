<?php

namespace App\Models;

use DateInterval;
use DateTime;
use DateTimeInterface;
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

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    protected $dateFormat = DATE_FORMAT;
    protected $dates = ['startTime'];

    protected function serializeDate(DateTimeInterface $date) : string
    {
        return $date->format(DATE_FORMAT);
    }

    static function getSeanceById(string $id)
    {
        return DB::table('seances')->where('id', $id)->first();
    }

    static function updateSeance($id,$startTime)
    {
        DB::table('seances')->where('id', $id)->update(['startTime' => $startTime]);
    }

    static function createSeance($movieId,$hallId,$startTime){

        $startTimeStr = $startTime->format(DATE_FORMAT);
        $newSeance = new Seance(['id' => uniqid(),
            'startTime' => $startTimeStr,
            'hallId' => $hallId,
            'movieId' => $movieId]);
        $newSeance->save();
    }
}
