import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Deals from './components/Deals';
import ProductDetail from './components/ProductDetail';
import Home from './components/Home';
import './App.css';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  )
}

export default App
