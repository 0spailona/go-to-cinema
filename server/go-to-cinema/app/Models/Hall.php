<?php

namespace App\Models;

use App\Models\viewModals\PlacesData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Hall extends Model
{
    use HasFactory;

    protected $table = "halls";
    protected string $name = "name";
    protected int $vipPrice = 350;
    protected int $standardPrice = 0;
    protected int $rowCount = 0;
    protected int $placesInRow = 0;
    protected PlacesData $places;
    protected $fillable = [
        'name',
        'places',
        'vipPrice',
        'standardPrice',
        'rowCount',
        'placesInRow',
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

    static function updateHallPrices($name,$vipPrice,$standardPrice)
    {
        DB::table('halls')->where('name', $name)->update(['vipPrice' => $vipPrice,'standardPrice' => $standardPrice]);
    }

}
