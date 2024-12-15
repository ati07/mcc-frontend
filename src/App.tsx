import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/loginPage";
import SchedulingPage from "./components/SchedulingPage";
import './App.css'
let baseUrl = import.meta.env.VITE_REACT_API_URL
const App = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {/* <div> */}
        <Routes>
          <Route
            path="/"
            element={<LoginPage baseUrl={baseUrl} />}
          />
          <Route
            path="/schedule"
            element={<SchedulingPage baseUrl={baseUrl}/>}
          />
        </Routes>
      {/* </div> */}
    </Router>
  );
};

export default App;
