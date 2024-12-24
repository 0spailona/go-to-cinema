<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Hall extends Model
{
    use HasFactory;

    protected $table = "halls";
    protected $name = "name";
    protected $vipPrice = "vipPrice";
    protected $standardPrice = "standardPrice";
    protected $casts = ["places"=>"object"];
    protected $fillable = [
        'name',
        'places',
        'vipPrice',
        'standardPrice',
    ];


    static function getHall($name){
        return DB::table('halls')->where('name', $name)->first();
    }

    static function deleteHall($name)
    {
        DB::table('halls')->where('name', $name)->delete();
    }

    static function updateHallPlaces($name,$places,$rowCount,$placesInRow)
    {

        DB::table('halls')->where('name', $name)->update(['places' => $places,'rowsCount' => $rowCount,'placesInRow' => $placesInRow]);
    }
}
