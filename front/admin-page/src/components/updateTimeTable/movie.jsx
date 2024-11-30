import Poster from "../../assets/i/poster.png";
import {useSelector} from "react-redux";
// eslint-disable-next-line react/prop-types
export default function Movie({movieId, index}) {

    const {films} = useSelector(state => state.films);
    const film = films[movieId];
    return (
        // eslint-disable-next-line react/prop-types
        //<div className="conf-step__movie" >
        <>    <img className="conf-step__movie-poster" alt="poster" src={film.poster ? film.poster : Poster}/>

            <h3 className="conf-step__movie-title">{film.title}</h3>

            <p className="conf-step__movie-duration">{film.time} минут</p></>

        //</div>

    );
}