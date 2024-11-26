import "../css/styles.css"
import "../css/normalize.css"
import NavDays from "./navDays.jsx";

export default function ClientPage() {
    return (<>
        <header className="page-header">
            <h1 className="page-header__title">Идём<span>в</span>кино</h1>
        </header>
        <NavDays/>
    </>);
}