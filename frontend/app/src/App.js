import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/screens/Home";
import Header from "./Components/screens/Header";
import EditApplicant from "./Components/screens/EditApplicant";
import Stats from "./Components/screens/Stats";
import LoginScreen from "./Components/screens/LoginScreen";


function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
        </Routes>
            <Routes>
              <Route exact path="/EditApplicant/:id" element={<EditApplicant />}></Route>
            </Routes>
            <Routes>
              <Route exact path="/StatisticsCollection" element={<Stats />}></Route>
            </Routes>
            <Routes>
              <Route exact path="/login" element={<LoginScreen />}></Route>
            </Routes>
           
            

      </BrowserRouter>
    </>

  );
}

export default App;
