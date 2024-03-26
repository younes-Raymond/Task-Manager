import React , {useEffect, useState , }from 'react';
import { BrowserRouter as Router, Routes, Route,useLocation  } from 'react-router-dom';
import Optionbox from './components/Home/option';
import ProductForm from './components/Admin/ProductForm.jsx';
import Aboutus from './components/Home/about-us';
import Header from './components/Layouts/Header';
import ProductDetailPage from './components/Home/ProductDetailPage';
import LoginPage from './components/Auth/SingIn.jsx';
import RegisterPage from './components/Auth/SingUp.jsx';
import Search from './components/Layouts/Search';
import Jobs from './components/Jobs/Jobs'
import AddWorkersForm from './components/Admin/add-workers' 
import AddJobForm  from './components/Admin/add-Jobs';
import Profile from './components/Home/profile/profile'
import Dashboard from './components/Admin/dashboard';
import ShowWorkers from './components/Admin/Show-workers'
import ShowMaterials from './components/Admin/ShowMaterials';
import ShowJobs from './components/Admin/Show-Jobs'
import LearnBoxes  from './components/Home/article/learnMoreBox';
import MarketingPlan  from './components/Home/article/Marketingblogs'
import SettingsComponent from './components/Home/profile/settings';
import ChatLayouts from './components/Home/ChatLayout/ChatLayout.jsx'
import ProtectedRoute from './Routes/ProtectedRoute.js';
import ForgetPassword from './components/Auth/ForgetPassword.jsx';


const App = () => {
  return (
    <>
      <Router>
         <Header />

        <Routes>
        <Route path="/singin" element={<LoginPage />} />       
        <Route path="/singup" element={<RegisterPage />} />
           {/* start user section     */}
          <Route path='/'  exact   element={
            <ProtectedRoute>
          <Optionbox />
            </ProtectedRoute>
          }></Route>

<Route path="/about-us" element={
    <ProtectedRoute>
        <Aboutus />
    </ProtectedRoute>
} />

<Route path="/show-products" element={
    <ProtectedRoute>
        <ProductDetailPage />
    </ProtectedRoute>
} />

<Route path="/search" element={
    <ProtectedRoute>
        <Search />
    </ProtectedRoute>
} />

<Route path="/Jobs" element={
    <ProtectedRoute>
        <Jobs />
    </ProtectedRoute>
} />

<Route path="/settings" element={
    <ProtectedRoute>
        <SettingsComponent />
    </ProtectedRoute>
} />

<Route path="/inbox" element={
    <ProtectedRoute>
        <ChatLayouts />
    </ProtectedRoute>
} />
<Route path="/profile" element={
    <ProtectedRoute>
        <Profile />
    </ProtectedRoute>
} />

{/* end users section*/}
      




{/* start Admin Dashboard Section */}
<Route path="/admin/add-worker" element={
  <ProtectedRoute isAdmin={true}>
    <AddWorkersForm />
  </ProtectedRoute>
}></Route>

<Route path="/admin/add-Jobs" element={
  <ProtectedRoute isAdmin={true}>
    <AddJobForm />
  </ProtectedRoute>
}></Route>

<Route path="/admin/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} ></Route>

<Route path="/admin/add-material" element={
  <ProtectedRoute isAdmin={true}>
    <ProductForm />
  </ProtectedRoute>
}></Route>

<Route path='/admin/showWorkers' element={
  <ProtectedRoute isAdmin={true}>
    <ShowWorkers />
  </ProtectedRoute>
}></Route>

<Route path='/admin/showMaterial' element={
  <ProtectedRoute isAdmin={true}>
    <ShowMaterials />
  </ProtectedRoute>
}></Route>

<Route path='/admin/ShowJobs' element={
  <ProtectedRoute isAdmin={true}>
    <ShowJobs />
  </ProtectedRoute>
}></Route>
{/* end Admin Dashboard Section */}
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/learn-more" element={<LearnBoxes />} />
          <Route path='/Marketing-plan' element={<MarketingPlan />} />

        </Routes>


      </Router>
    </>
  );

};

export default App;