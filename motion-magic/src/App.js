
import './App.css';
import Login from './login_signup/login/Login.js';
import React, {useState} from "react";
import Signup from './login_signup/signup/Signup';
import Home from './main-pages/Home'
import {BrowserRouter, Route, Routes, Navigate} from
      "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Solve from "./main-pages/Solve";
import History from "./main-pages/History"
import AllGlobalSolutions from "./main-pages/AllGlobalSolutions";




function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (

      <BrowserRouter>
        <Routes>
          <Route path='/login' element = {<Login setLoggedIn={setLoggedIn}/>} />
          <Route path='/' element={<Signup/>}/>
          { loggedIn ? (
              <Route path='/home' element={<Home setLoggedIn={setLoggedIn}/>}/>
          ) : (
              <Route path='/home' element={<Navigate replace to="/" />} ></Route>
          )

          }
          <Route path='/solve' element={<Solve/>} ></Route>
            <Route path='/history' element={<History/>} ></Route>
            <Route path='/global-solutions' element={<AllGlobalSolutions/>} ></Route>
        </Routes>
      </BrowserRouter>

  );
}

export default App;