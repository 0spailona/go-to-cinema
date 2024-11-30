import "../css/styles.css"
import "../css/normalize.css"
import NavDays from "./seances/navDays.jsx";
import {useSelector} from "react-redux";
import Movie from "./seances/movie.jsx";

export default function ClientPage() {

    const {films} = useSelector(state => state.films);

    return (<>
        <header className="page-header">
            <h1 className="page-header__title">Идём<span>в</span>кино</h1>
        </header>
        <NavDays/>
        <main>
            {Object.values(films).map(film => <Movie key={film.id} film={film} />)}
        </main>
    </>);
}