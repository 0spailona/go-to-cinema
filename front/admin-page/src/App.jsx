import AdminPage from "./components/adminPage.jsx";
import {useEffect, useState} from "react";
import {isAdmin} from "./js/api.js";

function App() {

    const [hasAdminRights, setHasAdminRights] = useState(false);
    const [error, setError] = useState({isError: false, message: ""});

    //console.log("app render");

  /*  const [a, setA] = useState(0);

    setTimeout(() => {
        setA(a + 1);
    }, 1000);*/

    useEffect(() => {
        async function toStart() {
            const response = await isAdmin();
            if (response.status === "success") {
                setHasAdminRights(true);
                setError({isError: false, message: ""});
            }
            else {
                setError({isError: true, message: "Проблемы с сервером. Попробуйте позже"});
            }
        }

        toStart();
    }, []);

    //console.log("app")
    //console.log(hasAdminRights);

    return (
        <>
            <header className="page-header">
                <h1 className="page-header__title">Идём<span>в</span>кино</h1>
                <span className="page-header__subtitle">Администраторррская</span>
            </header>
            {hasAdminRights ? <AdminPage/> : null}
            {error.isError ? <p className="">{error.message}</p> : null}
        </>
    );
}

export default App;
