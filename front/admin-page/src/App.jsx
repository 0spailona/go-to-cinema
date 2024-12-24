import {Route, Routes} from 'react-router-dom';
import AdminPage from "./components/adminPage.jsx";
import {useEffect} from "react";

function App() {

  return (
      <>
          <header className="page-header">
              <h1 className="page-header__title">Идём<span>в</span>кино</h1>
              <span className="page-header__subtitle">Администраторррская</span>
          </header>
              <AdminPage/>
      </>
  )
}

export default App
