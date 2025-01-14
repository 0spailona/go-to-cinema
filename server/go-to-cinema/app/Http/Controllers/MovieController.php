<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\viewModals\MovieData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MovieController
{
    private static array $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    private const SessionPostersDirPath = "posters/temp";
    private const PostersDirPath = "posters";
    private const DefaultPosterPath = "posters/default.jpg";

    private static function getCurrentSessionPosterPath() {
        return self::getPosterPathById(self::SessionPostersDirPath, session()->getId());
    }

    private static function getMoviePosterPath($movieId) {
        return self::getPosterPathById(self::PostersDirPath, $movieId);
    }

    private static function getPosterPathById(string $basePath, string $id )
    {
        $regex = "/$id\.[a-zA-Z0-9]+$/";
        $posters = Storage::files($basePath);

        foreach ($posters as $poster) {
            if (preg_match($regex, $poster)) {
                return $poster;
            }
        }
        return null;
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

        if (!ValidationUtils::checkString($title, 0, 50) || !ValidationUtils::checkString($country, 2, 130)
            || !ValidationUtils::checkString($description, 0, 200) || !ValidationUtils::checkInt($duration, 0, 1255)
            || !ValidationUtils::checkInt($release_year, 1895, $nowYear)) {
            return response()->json($wrong, 404);
        }

        $movieId = uniqid();

        $tempPosterPath = self::getCurrentSessionPosterPath();;
        $name = null;

        if ($tempPosterPath !== null) {
            $name = "$movieId." . pathinfo($tempPosterPath, PATHINFO_EXTENSION);
            $path = self::PostersDirPath . "/$name";
            Storage::move($tempPosterPath, $path);
        }

        $movie = new Movie(['id' => $movieId,
            'title' => $title,
            'country' => $country,
            'release_year' => $release_year,
            'duration' => $duration,
            'description' => $description,
            'poster' => $name,]);

        $movie->save();

        return response()->json(["status" => "ok", "movie create" => json_decode($request->getContent())], 201);
    }


    public function removeMovie(Request $request): \Illuminate\Http\JsonResponse
    {
        $id = $request->query('id');
        $movie = Movie::getMovie($id);

        if (Movie::getMovie($id) === null) {
            return response()->json(["status" => "error", "message" => "Фильма с таким названием нет в базе"], 404);
        }
        Movie::deleteMovie($id);

        return response()->json(["status" => "ok", "movie remove" => $id, "query" => $request->getQueryString(), "movie" => $movie]);
    }


    public function getMoviesList(): \Illuminate\Http\JsonResponse
    {
        $movies = Movie::all();

        $moviesData = $movies->map(function ($movie) {
            return MovieData::MakeMovieDataFromDb($movie);
        });

        return response()->json(["status" => "ok", "data" => $moviesData]);
    }

    public function getPoster(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $posterPath = self::getCurrentSessionPosterPath() ?? self::DefaultPosterPath;
        return Storage::response($posterPath);
    }

    public function getPosterByMovieId(string $movieId): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $posterPath = self::getMoviePosterPath($movieId) ?? self::DefaultPosterPath;
        return Storage::response($posterPath);
    }


    public function uploadPoster(Request $request): \Illuminate\Http\JsonResponse
    {
        $sessionId = session()->getId();
        $file = $request->file("poster");

        if (!in_array($file->getClientMimeType(), self::$allowedMimeTypes, true)) {
            return response()->json(["status" => "wrongMimeType", "mimeType" => $file->getClientMimeType()], 415);
        }

        $regex = "/\/$sessionId/";

        $posters = Storage::files(self::SessionPostersDirPath);
        $posters = array_values(array_filter($posters, function ($x) use ($regex) {
            return !!preg_match($regex, $x);
        }));

        Storage::delete($posters);

        $extension = $file->getClientOriginalExtension();
        $file->storeAs(self::SessionPostersDirPath, "$sessionId.$extension");

        return response()->json(["status" => "ok", "data" => "uploadPoster"]);
    }

    public static function getMoviesIds()
    {
        $movies = Movie::all();
        return $movies->map(function ($movie) {return $movie->id;});
    }
}
