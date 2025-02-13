import "../CSS/normalize.css";
import "../CSS/styles.css";

import ConfigHall from "./configHall/configHall.jsx";
import ConfigPrice from "./configPrice.jsx";
import SeanceTable from "./seanceTable/seanceTable.jsx";
import SailsControl from "./sailsControl.jsx";
import {useEffect, useState} from "react";
import {setCanUpdate, setConfig, setHalls, setLoadingHalls} from "../redux/slices/halls.js";
import {useDispatch, useSelector} from "react-redux";
import {getHallConfig, getHalls, getMovies, isOpenSails, logOut} from "../js/api.js";
import {setLoadingMovies, setMovies} from "../redux/slices/movies.js";
import PopupError from "./common/popupError.jsx";
import MyButton from "./common/myButton.jsx";
import HallControl from "./hallControl.jsx";
import {setError} from "../redux/slices/common.js";

export default function AdminPage() {

    const dispatch = useDispatch();
    const {error} = useSelector(state => state.common);

    const [errorView, setErrorView] = useState({isError: false, message: ""});

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

    const isCanUpdate = async () => {

        const response = await isOpenSails();

        if (response.status !== "success") {
            dispatch(setCanUpdate(false));
        }
        else {
            dispatch(setCanUpdate(!response.data));
        }
    };

    useEffect(() => {

        async function toStart() {
            if (!await getHallConfigFromServer() ||
                !await getHallsFromServer() ||
                !await getMoviesFromServer()) {
                setErrorView({isError: true, message: "Проблемы с сервером. Попробуйте позже"});
            }
            await isCanUpdate();
        }

        toStart();

    }, []);

    useEffect(() => {
        if(!error){
            setErrorView({isError: false, message: ""})
        }
        if (error) {
            setErrorView({isError: true, message: error});
        }
    }, [error]);

    const onLogOut = async () => {
         await logOut();
    };


    return (<>
            <PopupError showPopup={errorView.isError} text={errorView.message}
                        closePopup={()=>dispatch(setError(null))}/>
            <main className="conf-steps">
                <HallControl/>
                <ConfigHall/>
                <ConfigPrice/>
                <SeanceTable/>
                <SailsControl/>
            </main>
            <div className="logout-wrp">
                <MyButton text="Выйти" type="submit" onclick={onLogOut}/>
            </div>

        </>
    );
}

