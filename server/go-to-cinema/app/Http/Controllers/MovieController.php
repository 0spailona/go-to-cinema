<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\viewModals\MovieData;
use Illuminate\Http\Request;

class MovieController
{

    public function createMovie(Request $request): \Illuminate\Http\JsonResponse
    {
        $wrong = ["status" => "error", "message" => "Неправильные данные", "data" => json_decode($request->getContent())];

        $data = json_decode($request->getContent());
        $title = $data->title;
        $country = $data->country;
        $release_year = $data->releaseYear;
        $duration = $data->duration;
        $description = $data->description;


        $movie = new Movie(['id' => uniqid(), 'title' => $title, 'country' => $country, 'release_year' => $release_year, 'duration' => $duration, 'description' => $description]);

        $movie->save();

        return response()->json(["status" => "ok", "movie create" => json_decode($request->getContent())], 201);
    }


    public function removeMovie(Request $request): \Illuminate\Http\JsonResponse
    {


        $id = $request->query('id');
        $movie = Movie::getMovie($id);
        Movie::deleteMovie($id);

        return response()->json(["status" => "ok", "movie remove" => $id, "query" => $request->getQueryString(),"movie"=>$movie], 201);
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
