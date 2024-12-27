<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController
{

    public function createMovie(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->getContent();

        return response()->json(["status" => "ok", "movie create" => json_decode($request->getContent())], 201);
    }

    public function removeMovie(Request $request): \Illuminate\Http\JsonResponse
    {
        return response()->json(["status" => "ok", "movie remove" => json_decode($request->getContent())], 201);
    }

    public function getMoviesList(): \Illuminate\Http\JsonResponse{

        $movies = Movie::all();
        return response()->json(["status" => "ok", "movies list" => $movies]);
    }
}
