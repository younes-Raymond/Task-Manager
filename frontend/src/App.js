import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Optionbox from './components/Home/option';
import ProductForm from './components/Admin/ProductForm.jsx';
import Aboutus from './components/Home/about-us';
import Header from './components/Layouts/Header';
import ProductDetailPage from './components/Home/ProductDetailPage';
import LoginPage from './components/Home/Login/Login';
import RegisterPage from './components/Home/Login/RegisterPage';


const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Optionbox />} />
          <Route path="/add-product" element={<ProductForm />} />
          <Route path="/about-us" element={<Aboutus />} />
          <Route path="/show-products" element={<ProductDetailPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;