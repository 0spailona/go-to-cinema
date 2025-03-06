<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sails extends Model
{
    use HasFactory;

    protected $table = 'sails';
    protected $isOpenSails;
    protected $sessionId;

    protected $fillable = ['isOpenSails', 'sessionId'];

    protected $hidden = [
        'created_at', 'updated_at'
    ];
    protected $dateFormat = DATE_FORMAT;

    protected function serializeDate(DateTimeInterface $date) : string
    {
        return $date->format(DATE_FORMAT);
    }
}
