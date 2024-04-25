import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from "./Components/Home";
import Login from './Components/Login';
import Register from './Components/Signup';
import NotFound from './Components/NotFound';
import Contacts from './Components/Contacts';

function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
