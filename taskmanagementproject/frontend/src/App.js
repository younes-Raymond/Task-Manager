import React , {useEffect, useState , }from 'react';
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
import Profile from './components/Home/profile/profile'
import Dashboard from './components/Admin/dashboard';
import MainData from './components/Admin/MainData';
import ShowWorkers from './components/Admin/Show-workers'
import ShowMaterials from './components/Admin/ShowMaterials';
import ShowJobs from './components/Admin/Show-Jobs'
import PrivateRoutes from './Routes/PrivateRoutes';
import CheckUserRole  from './Routes/checkUserRole';
import LearnBoxes  from './components/Home/article/learnMoreBox';
import MarketingPlan  from './components/Home/article/Marketingblogs'
import SettingsComponent from './components/Home/profile/settings';
import HomeTest from './components/test/HomeTest.jsx'


const userRole = CheckUserRole()





const App = () => {
  return (
    <>
      <Router>
        {userRole !== 'unknown' && (
          <Header />
        )}
        <Routes>
          <Route element={<PrivateRoutes /> }>
           {/* start user section              */}
          <Route element={<Optionbox />} path='/' exact />
          <Route path="/about-us" element={<Aboutus />} />
          <Route path="/show-products" element={<ProductDetailPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/Jobs" element={<Jobs />} />
          <Route path="/settings" element={<SettingsComponent />} />

          {/* start users section                        */}
      
            {userRole === 'admin' && (
              <>
          {/*  start   admin   dashboard section  */}
          <Route path="/admin/option" element={<OptionDashboard />} />
          <Route path="/admin/add-worker" element={<AddWorkersForm />} />
          <Route path="/admin/add-Jobs" element={<AddJobForm />} />
          <Route path="/admin/dashboard" element={<Dashboard/>} />
          <Route path="/admin/add-material" element={<ProductForm />} />
          <Route path='/admin/showWorkers' element={<ShowWorkers />} />
          <Route path='/admin/showMaterial' element={<ShowMaterials />} />
          <Route path='/admin/ShowJobs' element={<ShowJobs />} /> 
        {/*end   admin   dashboard section  */}

              </>
        )}

        {/* start profile section  */}
        <Route path="/profile" element={<Profile />} />
        {/* end  profile section  */}
          </Route>
          <Route path='/Support' element={<HomeTest />}/>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />       
          <Route path="/learn-more" element={<LearnBoxes />} />
          <Route path='/Marketing-plan' element={<MarketingPlan />} />
          {/* <Route path="/" element={<Optionbox />} /> */}   

        </Routes>
      </Router>
    </>
  );

};

export default App;