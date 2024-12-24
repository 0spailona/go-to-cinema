import "../CSS/normalize.css";
import "../CSS/styles.css";

import ToCreateHall from "./toCreateHall.jsx";
import ToUpdateHall from "./updateHall/toUpdateHall.jsx";
import ToUpdatePrice from "./toUpdatePrice.jsx";
import ToUpdateTimeTable from "./updateTimeTable/toUpdateTimeTable.jsx";
import ToOpenSales from "./toOpenSales.jsx";
import {useEffect} from "react";
import {fetchHalls} from "../redux/slices/halls.js";
import {useDispatch} from "react-redux";

export default function AdminPage() {

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(fetchHalls());
    }, []);

    return (
        <main className="conf-steps">
            <ToCreateHall/>
            <ToUpdateHall/>
        </main>
    );
}

/*

            <ToUpdatePrice/>
            <ToUpdateTimeTable/>
            <ToOpenSales/>*/