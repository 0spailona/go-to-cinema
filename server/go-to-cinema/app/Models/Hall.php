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
    protected string $id = 'id';
    protected string $name = "name";
    protected int $vipPrice = 350;
    protected int $standardPrice = 0;
    protected int $rowCount = 0;
    protected int $placesInRow = 0;
    protected PlacesData $places;
    protected $fillable = [
        'id',
        'name',
        'places',
        'vipPrice',
        'standardPrice',
        'rowsCount',
        'placesInRow',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public $incrementing = false;

    // In Laravel 6.0+ make sure to also set $keyType
    protected $keyType = 'string';

    static function byName($name)
    {
        return self::where('name', $name)->first();
    }

    static function byId($id)
    {
        return self::where('id', $id)->first();
    }

/*




    static function deleteHall($id)
    {
        DB::table('halls')->where('id', $id)->delete();
    }

    static function updateHallPlaces($id,$places,$rowCount,$placesInRow)
    {
        DB::table('halls')->where('id', $id)->update(['places' => $places,'rowsCount' => $rowCount,'placesInRow' => $placesInRow]);
    }

    static function updateHallPrices($id,$vipPrice,$standardPrice)
    {
        DB::table('halls')->where('id', $id)->update(['vipPrice' => $vipPrice,'standardPrice' => $standardPrice]);
    }
*/
}
