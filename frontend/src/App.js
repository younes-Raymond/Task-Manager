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
          <Route path="/" element={
          <Optionbox />
          } />
        </Routes>
        <Routes>
          <Route path="/add-product" element={
          <ProductForm />
          } />
        </Routes>
        <Routes>
          <Route path="/about-us" element={
          <Aboutus />
          } />
        </Routes>
        <Routes>
          <Route path="/show-products" element={
          <ProductDetailPage  />
          } />
        </Routes>
        <Routes>
  <Route path="/register" element={
  <RegisterPage />
  } />
</Routes>
<Routes>
  <Route path="/login" element={
  <LoginPage />
  } />
</Routes>
</Router>
    </>
  );
};

export default App;