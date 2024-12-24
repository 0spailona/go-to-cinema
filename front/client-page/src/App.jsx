import {Route, Routes} from 'react-router-dom';
import ClientPage from "./components/clientPage.jsx";
import Hall from "./components/hall/hall.jsx";
import Ticket from "./components/ticket/ticket.jsx";

function App() {

    return (
        <>
            <header className="page-header">
                <h1 className="page-header__title">Идём<span>в</span>кино</h1>
            </header>
            <Routes>
                <Route path="/" element={<ClientPage/>}/>
                <Route path="/seance" element={<Hall/>}/>
                <Route path="/ticket" element={<Ticket/>}/>
            </Routes>
        </>
    )
}

export default App