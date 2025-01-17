import "../CSS/normalize.css";
import "../CSS/styles.css";

import ToCreateHall from "./toCreateHall.jsx";
import ToUpdateHall from "./updateHall/toUpdateHall.jsx";
import ToUpdatePrice from "./toUpdatePrice.jsx";
import ToUpdateTimeTable from "./updateTimeTable/toUpdateTimeTable.jsx";
import ToOpenSales from "./toOpenSales.jsx";
import {useEffect} from "react";
import {//fetchHallConfig,
    setConfig, setHalls, setLoadingHalls} from "../redux/slices/halls.js";
import {useDispatch} from "react-redux";
import {fetchMovies} from "../redux/slices/movies.js";
import {getHallConfig, getHalls} from "../js/api.js";

export default function AdminPage() {

    const dispatch = useDispatch();

    const getHallsFromServer = async () => {
        dispatch(setLoadingHalls(true));
        const response = await getHalls();
        if (response.status === "success") {
            dispatch(setHalls(response.data));
        }
        else {
            //TODO ERROR
        }
        dispatch(setLoadingHalls(false));
    };

    const getHallConfigFromServer = async () => {
        dispatch(setLoadingHalls(true));
        const response = await getHallConfig();
        if (response.status === "success") {
            dispatch(setConfig(response.data));
        }
        else {
            //TODO ERROR
        }
        dispatch(setLoadingHalls(false));
    };


    useEffect(() => {
        //console.log("adminPage useEffect");
        //dispatch(fetchHallConfig());

        //dispatch(fetchHalls());
        async function toStart() {
            await getHallConfigFromServer();
            await getHallsFromServer();
        }
        toStart();
        dispatch(fetchMovies());
        //const chosenDate = toISOStringNoMs(today);
        //dispatch(getSeancesByDate(chosenDate))
    }, []);

    return (
        <main className="conf-steps">
            <ToCreateHall/>
            <ToUpdateHall/>
            <ToUpdatePrice/>
            <ToUpdateTimeTable/>
            <ToOpenSales/>
        </main>
    );
}

/*



            */