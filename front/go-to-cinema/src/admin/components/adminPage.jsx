import "../CSS/normalize.css";
import "../CSS/styles.css"

import ToCreateHall from "./toCreateHall.jsx";
import ToUpdateHall from "./updateHall/toUpdateHall.jsx";
import ToUpdatePrice from "./toUpdatePrice.jsx";
import ToUpdateTimeTable from "./updateTimeTable/toUpdateTimeTable.jsx";
import ToOpenSales from "./toOpenSales.jsx";

export default function AdminPage() {
    return (
        <>
            <header className="page-header">
                <h1 className="page-header__title">Идём<span>в</span>кино</h1>
                <span className="page-header__subtitle">Администраторррская</span>
            </header>
            <main className="conf-steps">
             <ToCreateHall/>
                <ToUpdateHall/>
                <ToUpdatePrice/>
                <ToUpdateTimeTable/>
                <ToOpenSales/>
        </main>
</>
);
}