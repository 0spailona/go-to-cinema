<?php

namespace App\Models\viewModals;

class MovieData
{
    public string $id = 'id';
    public string $title = 'title';
    public string $country = 'country';
    public int $duration = 0;
    public string $description = 'description';
    public int $release_year = 0;
    public $poster = null;

    static function MakeMovieDataFromDb($movie): MovieData
    {
        $movieData = new MovieData();
        $movieData->id = $movie->id;
        $movieData->title = $movie->title;
        $movieData->country = $movie->country;
        $movieData->duration = $movie->duration;
        $movieData->description = $movie->description;
        $movieData->release_year = $movie->release_year;

        return $movieData;
    }
}
