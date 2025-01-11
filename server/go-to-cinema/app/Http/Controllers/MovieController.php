<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\viewModals\MovieData;
use Illuminate\Http\Request;

class MovieController
{

    private function checkString($value, int $min, int $max): bool
    {
        $valueStr = trim($value);
        if (!is_string($value) || strlen($valueStr) < $min || strlen($valueStr) > $max) {
            return false;
        }
        return true;
    }

    private function checkInt($value, int $min, int $max): bool
    {
        if (!is_int($value) || $value < $min || $value >= $max) {
            return false;
        }
        return true;
    }

    public function createMovie(Request $request): \Illuminate\Http\JsonResponse
    {
        $wrong = ["status" => "error", "message" => "Неправильные данные", "data" => json_decode($request->getContent())];

        $data = json_decode($request->getContent());
        $title = $data->title;
        $country = $data->country;
        $release_year = $data->releaseYear;
        $duration = $data->duration;
        $description = $data->description;
        $nowYear = intval(date("Y"));

        if(!$this->checkString($title,0,50) || !$this->checkString($country,2,130)
        || !$this->checkString($description,0,200) || !$this->checkInt($duration,0,1255)
        || !$this->checkInt($release_year,1895,$nowYear)){
            return response()->json($wrong, 404);
            }

        $movie = new Movie(['id' => uniqid(), 'title' => $title, 'country' => $country, 'release_year' => $release_year, 'duration' => $duration, 'description' => $description]);
        $movie->save();

        return response()->json(["status" => "ok", "movie create" => json_decode($request->getContent())], 201);
    }


    public function removeMovie(Request $request): \Illuminate\Http\JsonResponse
    {
        $id = $request->query('id');
        $movie = Movie::getMovie($id);

        if(Movie::getMovie($id) === null){
            return response()->json(["status" => "error", "message" => "Фильма с таким названием нет в базе"], 404);
        }
        Movie::deleteMovie($id);

        return response()->json(["status" => "ok", "movie remove" => $id, "query" => $request->getQueryString(),"movie"=>$movie]);
    }


    public function getMoviesList(): \Illuminate\Http\JsonResponse
    {
        $movies = Movie::all();

        $moviesData = $movies->map(function ($movie) {
            return MovieData::MakeMovieDataFromDb($movie);
        });
        return response()->json(["status" => "ok", "data" => $moviesData]);
    }
}
