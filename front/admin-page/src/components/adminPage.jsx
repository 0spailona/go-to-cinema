import "../CSS/normalize.css";
import "../CSS/styles.css";

import ToCreateHall from "./toCreateHall.jsx";
import ToUpdateHall from "./updateHall/toUpdateHall.jsx";
import ToUpdatePrice from "./toUpdatePrice.jsx";
import ToUpdateTimeTable from "./updateTimeTable/toUpdateTimeTable.jsx";
import ToOpenSales from "./toOpenSales.jsx";

export default function AdminPage() {
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