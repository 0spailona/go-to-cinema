//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import {Route, Routes} from 'react-router-dom';
import AdminPage from "./admin/components/adminPage.jsx";
import ClientPage from "./client/clientPage.jsx";

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/admin" element={<AdminPage/>}/>
        <Route path="/client" element={<ClientPage/>}/>
      </Routes>
    </>
  )
}

export default App
