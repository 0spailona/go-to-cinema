import {Route, Routes} from 'react-router-dom';
import ClientPage from "./components/clientPage.jsx";
import Hall from "./components/hall/hall.jsx";
import Ticket from "./components/ticket/ticket.jsx";
import {setIsDrawPage} from "./redux/slices/cinema.js";
import {useEffect} from "react";
import {isOpenSails} from "./js/api.js";
import {useDispatch} from "react-redux";

function App() {

    const dispatch = useDispatch();

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

    return (
        <>

            <header className="page-header">
                <h1 className="page-header__title">Идём<span>в</span>кино</h1>
            </header>
            <Routes>
                <Route path="/" element={<ClientPage/>}/>
                <Route path="/hall" element={<Hall/>}/>
                <Route path="/ticket" element={<Ticket/>}/>
            </Routes>
        </>
    )
}

export default App
