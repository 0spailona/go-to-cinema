import "../CSS/normalize.css";
import "../CSS/styles.css";

import ToCreateHall from "./toCreateHall.jsx";
import ToUpdateHall from "./updateHall/toUpdateHall.jsx";
import ToUpdatePrice from "./toUpdatePrice.jsx";
import ToUpdateTimeTable from "./updateTimeTable/toUpdateTimeTable.jsx";
import ToOpenSales from "./toOpenSales.jsx";
import {useEffect, useState} from "react";
import {setConfig, setHalls, setLoadingHalls} from "../redux/slices/halls.js";
import {useDispatch} from "react-redux";
//import {fetchMovies} from "../redux/slices/movies.js";
import {getHallConfig, getHalls, getMovies, logOut} from "../js/api.js";
import {setLoadingMovies, setMovies} from "../redux/slices/movies.js";
import PopupError from "./common/popupError.jsx";
import MyButton from "./common/myButton.jsx";

export default function AdminPage() {

    const dispatch = useDispatch();
    const [error, setError] = useState({isError: false, message: ""});

    const getHallsFromServer = async () => {
        dispatch(setLoadingHalls(true));
        const response = await getHalls();
        if (response.status === "success") {
            dispatch(setHalls(response.data));
            dispatch(setLoadingHalls(false));
            return true;
        }
        else {
            dispatch(setLoadingHalls(false));
            return false;
        }
    };

    const getHallConfigFromServer = async () => {
        dispatch(setLoadingHalls(true));
        const response = await getHallConfig();
        if (response.status === "success") {
            dispatch(setConfig(response.data));
            dispatch(setLoadingHalls(false));
            return true;
        }
        else {
            dispatch(setLoadingHalls(false));
            return false;
        }
    };

    const getMoviesFromServer = async () => {
        dispatch(setLoadingMovies(true));
        const response = await getMovies();
        if (response.status === "success") {
            dispatch(setMovies(response.data));
            dispatch(setLoadingMovies(false));
            return true;
        }
        else {
            dispatch(setLoadingMovies(false));
            return false;
        }
    };


    useEffect(() => {

        async function toStart() {
            //await fetchToken()
            if (!await getHallConfigFromServer() ||
                !await getHallsFromServer() ||
                !await getMoviesFromServer()) {
                setError({isError: true, message: "Проблемы с сервером. Попробуйте позже"});
            }
        }

        toStart();

    }, []);

    const onLogOut = async () => {
        const response = await logOut();
        if (response.status === "success") {
            window.location = "admin/login";
        }
        else {

        }
    }

    return (<>
            <PopupError showPopup={error.isError} text={error.message}
                        onClose={()=>setError({isError: false, message: ""})}/>.
            <main className="conf-steps">
                <ToCreateHall/>
                <ToUpdateHall/>
                <ToUpdatePrice/>
                <ToUpdateTimeTable/>
                <ToOpenSales/>
            </main>
            <div className="logout-wrp">
                <MyButton text="Выйти" type="submit" onclick={onLogOut}/>
            </div>

        </>
    );
}

