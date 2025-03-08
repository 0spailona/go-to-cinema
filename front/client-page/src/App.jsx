import {Route, Routes} from 'react-router-dom';
import ClientPage from "./components/clientPage.jsx";
import SeanceHall from "./components/hall/seanceHall.jsx";
import Ticket from "./components/ticket/ticket.jsx";
import {setError, setHalls, setIsDrawPage, setLoading, setMovies, setSeances} from "./redux/slices/cinema.js";
import {useEffect} from "react";
import {getHalls, getMovies, getSeancesByDate, isOpenSails} from "./js/api.js";
import {useDispatch, useSelector} from "react-redux";

function App() {

    const dispatch = useDispatch();
    const {seances, chosenDate, isDrawPage, loading, lastIsDrawPage, error} = useSelector(state => state.cinema);

    const isDrawFilms = async () => {

        const response = await isOpenSails();

        if (response.status === "success") {
            dispatch(setIsDrawPage(response.data));
        }
        else {
            dispatch(setIsDrawPage(false));
        }
    };

    useEffect(isDrawFilms, []);

    const getMoviesFromServer = async () => {
        dispatch(setLoading(true));

        const response = await getMovies();
        if (response.status === "success") {
            dispatch(setMovies(response.data));
        }
        else {
            dispatch(setError("Проблемы с сервером. Попробуйте позже"));
        }
        dispatch(setLoading(false));
    };

    const getHallsFromServer = async () => {
        dispatch(setLoading(true));
        const response = await getHalls();
        if (response.status === "success") {
            dispatch(setHalls(response.data));
        }
        else {
            dispatch(setError("Проблемы с сервером. Попробуйте позже"));
        }
        dispatch(setLoading(false));
    };

    const getSeances = async (date) => {
        dispatch(setLoading(true));
        const response = await getSeancesByDate(date);

        if (response.status === "success") {
            dispatch(setSeances(response.data))
        }
        else {
            dispatch(setError("Проблемы с сервером. Попробуйте позже"));
        }
        dispatch(setLoading(false));
    };


    const updateData = async () => {
        await getHallsFromServer();
        await getMoviesFromServer();
        await getSeances(chosenDate);
    };

    useEffect(() => {

        if (isDrawPage && !lastIsDrawPage) {
            async function toGetNewData() {
                await updateData();
            }

            toGetNewData();
        }
    }, [isDrawPage]);

    return (
        <>

            <header className="page-header">
                <h1 className="page-header__title">Идём<span>в</span>кино</h1>
            </header>
            <Routes>
                <Route path="/" element={<ClientPage/>}/>
                <Route path="/seanceHall" element={<SeanceHall/>}/>
                <Route path="/ticket" element={<Ticket/>}/>
            </Routes>
        </>
    )
}

export default App
