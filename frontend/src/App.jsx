import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Collection from './pages/Collection';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Orders from './pages/Orders';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Navbar from './components/Navbar';
import Footer from './components/Footer.';
import Searchbar from './components/Searchbar';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import { ToastContainer, toast } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <div className='px-4 sm:px[5vw] md:px[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <Searchbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/orders' element={<Orders />} />
        <Route 
            path="/cart" 
            element={<Cart />} 
          />
        <Route path='/login' element={<Login />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/place-order' element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
        <Route path="/admin/" element={<Admin />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
