import PosterDefault from "../../assets/i/poster1.jpg"
import SeancesHall from "./seancesHall.jsx";
import {useSelector} from "react-redux";
import {getWeekdayNumber} from "../../js/utils.js";


export default function Movie({filmId,movieSeancesByHallId}) {

    const {films,seances} = useSelector(state => state.cinema);
    const film = films[filmId];
    //const movieSeancesByHalls = seances[filmId];
    //const day = getWeekdayNumber(chosenDate)
    //console.log("Movie film",film);

    return (
        <section className="movie">
            <div className="movie__info">
                <div className="movie__poster">
                    <img className="movie__poster-image" alt="Звёздные войны постер" src={`api/posterByMovieId/${film.id}`}/>
                </div>
                <div className="movie__description">
                    <h2 className="movie__title">{film.title}</h2>
                    <p className="movie__synopsis">{film.description}</p>
                    <p className="movie__data">
                        <span className="movie__data-duration">{film.duration} минут</span>{"\u00A0"}
                        <span className="movie__data-origin">{film.country}</span>
                    </p>
                </div>
            </div>
            {Object.keys(movieSeancesByHallId).map(hallId => <SeancesHall key={hallId} hallId={hallId}
                                                                         seances={movieSeancesByHallId[hallId]}/>)}
        </section>
    )
}