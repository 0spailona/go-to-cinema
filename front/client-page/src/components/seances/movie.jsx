import PosterDefault from "../../assets/i/poster1.jpg"
import SeancesHall from "./seancesHall.jsx";
import {useSelector} from "react-redux";
import {getWeekdayNumber} from "../../js/utils.js";


export default function Movie({film}) {

    const {chosenDate} = useSelector(state => state.cinema);
    const day = getWeekdayNumber(chosenDate)
    //console.log("Movie film",film);

    return (
        <section className="movie">
            <div className="movie__info">
                <div className="movie__poster">
                    <img className="movie__poster-image" alt="Звёздные войны постер" src={film.poster ? film.poster : PosterDefault}/>
                </div>
                <div className="movie__description">
                    <h2 className="movie__title">{film.title}</h2>
                    <p className="movie__synopsis">{film.description}</p>
                    <p className="movie__data">
                        <span className="movie__data-duration">{film.time} минут</span>
                        <span className="movie__data-origin">{film.country}</span>
                    </p>
                </div>
            </div>
            {Object.keys(film.seances[day]).map(hallId => <SeancesHall key={hallId} hallId={hallId} filmId={film.id} />)}
        </section>
    )
}