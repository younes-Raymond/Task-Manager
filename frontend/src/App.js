import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Optionbox from './components/Home/option';
import ProductForm from './components/Admin/ProductForm.jsx';
import Aboutus from './components/Home/about-us';
import Header from './components/Layouts/Header';
import ProductDetailPage from './components/Home/ProductDetailPage';
import LoginPage from './components/Home/Login/Login';
import RegisterPage from './components/Home/Login/RegisterPage';
import Search from './components/Layouts/Search';
import Jobs from './components/Jobs/Jobs'
import OptionDashboard from './components/Admin/options' 
import AddWorkersForm from './components/Admin/add-workers' 
import AddJobForm  from './components/Admin/add-Jobs';

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Optionbox />} />
          <Route path="/add-material" element={<ProductForm />} />
          <Route path="/about-us" element={<Aboutus />} />
          <Route path="/show-products" element={<ProductDetailPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/Jobs" element={<Jobs />} />
        {/*  start    dashboard section  */}
          <Route path="/option" element={<OptionDashboard />} />
          <Route path="/add-worker" element={<AddWorkersForm />} />
          <Route path="/add-Jobs" element={<AddJobForm />} />
        {/*end dashboard section  */}
        </Routes>
      </Router>
    </>
  );
};

export default App;