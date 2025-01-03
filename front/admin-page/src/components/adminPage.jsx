import "../CSS/normalize.css";
import "../CSS/styles.css";

import ToCreateHall from "./toCreateHall.jsx";
import ToUpdateHall from "./updateHall/toUpdateHall.jsx";
import ToUpdatePrice from "./toUpdatePrice.jsx";
import ToUpdateTimeTable from "./updateTimeTable/toUpdateTimeTable.jsx";
import ToOpenSales from "./toOpenSales.jsx";
import {useEffect} from "react";
import {fetchHallConfig, fetchHalls} from "../redux/slices/halls.js";
import {useDispatch} from "react-redux";
import {fetchMovies} from "../redux/slices/films.js";

export default function AdminPage() {

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(fetchHallConfig())
        dispatch(fetchHalls());
        dispatch(fetchMovies())
    }, []);

    return (
        <main className="conf-steps">
            <ToCreateHall/>
            <ToUpdateHall/>
            <ToUpdatePrice/>
            <ToUpdateTimeTable/>
        </main>
    );
}

/*



            <ToOpenSales/>*/