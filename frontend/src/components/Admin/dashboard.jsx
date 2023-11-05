import React, { useEffect, useState } from 'react';
import SideBar from './SideBar/SideBar';
import MenuIcon from '@mui/icons-material/Menu';
import MainData from './MainData';
import './SideBar/SideBar.css';
import { 
  IconButton,
  AppBar,
  Button

} from '@mui/material/'

const Dashboard = ({ activeTab, children }) => {
  const [onMobile, setOnMobile] = useState(false);
  const [toggleSideBar, setToggleSideBar] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 600) {
      setOnMobile(true);
    }
  }, []);

  
  return (
    <>
      <div className="whole-container">
        <main className="">
          {!onMobile && (
            <div className={`menu-container ${toggleSideBar ? 'hide' : ''}`}>
              <Button
                onClick={() => setToggleSideBar(true)}
              >
                <MenuIcon />
              </Button>

            </div>
          )}

          {toggleSideBar && (
            <SideBar
              activeTab={activeTab}
              setToggleSideBar={setToggleSideBar}
              onCloseSideBar={() => setToggleSideBar(false)}
            />
          )}
           
          
          <MainData />

        </main>
      </div>
    </>
  );
};

export default Dashboard;
