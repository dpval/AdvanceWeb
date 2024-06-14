import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Signup';
import NotFound from './Components/NotFound';
import Contacts from './Components/Contacts';
import Story from './Components/Story';
import Home from './Components/Home';
import AddProducts from './Components/AddProducts';
import Memories from './Components/Memories';
import Cart from './Components/Cart';
import Save from './Components/Save';
import { AuthProvider } from './Components/AuthContext';
import Product from './Components/Products';



function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="App">
      

          <Routes>
            <Route path="/" element={<Product />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
           
            <Route path="/signup" element={<Register />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/addproduct" element={<AddProducts />} />
            <Route path="/story" element={<Story />} />
            <Route path="/memories" element={<Memories />} />
            <Route path="/products" element={<Product />} />
            <Route path="/save" element={<Save />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
