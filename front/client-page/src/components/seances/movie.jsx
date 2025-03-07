import SeancesHall from "./seancesHall.jsx";
import {useSelector} from "react-redux";

export default function Movie({movieId, movieSeancesByHallId, onChooseSeance}) {

    const {movies} = useSelector(state => state.cinema);
    const movie = movies[movieId];

    return (
        <section className="movie">
            <div className="movie__info">
                <div className="movie__poster">
                    <img className="movie__poster-image" alt="Звёздные войны постер"
                         src={`api/posterByMovieId/${movie.id}`}/>
                </div>
                <div className="movie__description">
                    <h2 className="movie__title">{movie.title}</h2>
                    <p className="movie__synopsis">{movie.description}</p>
                    <p className="movie__data">
                        <span className="movie__data-duration">{movie.duration} минут</span>{"\u00A0"}
                        <span className="movie__data-origin">{movie.country}</span>
                    </p>
                </div>
            </div>
            {Object.keys(movieSeancesByHallId).map(hallId => <SeancesHall key={hallId} hallId={hallId}
                                                                          seances={movieSeancesByHallId[hallId]}
                                                                          onChooseSeance={(seanceId) => {
                                                                              //console.log("Movie seanceId",seanceId);
                                                                              onChooseSeance(seanceId);
                                                                          }}/>)}
        </section>
    );
}