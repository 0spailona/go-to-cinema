<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seance extends Model
{
    use HasFactory;

    protected $table = 'seances';
    protected string $id;
    protected string $movieID;
    protected string $startTime;
    protected $fillable = [
        'id',
        'movieID',
        'startTime',
    ];


}
