import {Route, Routes} from 'react-router-dom';
import AdminPage from "./components/adminPage.jsx";
import {useEffect, useState} from "react";
import {isAdmin} from "./js/api.js";

function App() {

    const [hasAdminRights, setHasAdminRights] = useState(false);
    const [error, setError] = useState({isError: false,message: ""});

    useEffect(() => {
        async function toStart() {
            //await fetchToken()

            const response = await isAdmin();
            if(response.status === "success") {
                setHasAdminRights(true);
                setError({isError: false, message: ""});
            }
            else{
                setError({isError: true, message: "Проблемы с сервером. Попробуйте позже"});
            }
        }

        toStart();
    },[])

  return (
      <>
          <header className="page-header">
              <h1 className="page-header__title">Идём<span>в</span>кино</h1>
              <span className="page-header__subtitle">Администраторррская</span>
          </header>
          {hasAdminRights ? <AdminPage /> : null}
          {error.isError ? <p className="">{error.message}</p> : null}
      </>
  )
}

export default App
