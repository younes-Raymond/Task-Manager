import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AccountCircle, NotificationsActiveTwoTone } from '@mui/icons-material'; 
import Searchbar from './Searchbar';
import logo from '../../assets/images/logo.png';
import './Header.css';

const Header = () => {
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');
  const [hideAccountIcon, setHideAccountIcon] = useState(false);
  const accountIconRef = React.useRef(null);
  const [requestCounter, setRequestCounter] = useState(0); 

  useEffect(() => {
    const checkLocalStorage = () => {
      const user  = JSON.parse(localStorage.getItem('user'));
      const avatarUrl = user.avatar.url
      if(user && user.avatar && user.avatar.url && avatarUrl){
        console.log(user.avatar.url)
        setCloudinaryUrl(avatarUrl);
        setHideAccountIcon(true);
      }
      checkLocalStorage()
    };

    let interval;
    if (!hideAccountIcon) {
      console.log('Checking local storage');
      interval = setInterval(() => {
        const requestData = JSON.parse(localStorage.getItem('requestData'));
        setRequestCounter(requestData?.message ? 1 : 0);
        checkLocalStorage();
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [hideAccountIcon]);

  return (
    <header className="Header">
      <div className="container">
        <div className="logo-search-bar-container">
          <Link to="/">
            <img draggable="false" src={logo} alt="AllMart Logo" id="logo" />
          </Link>
          <Searchbar />
        </div>
        <div className="login-icon-container">
          {cloudinaryUrl ? (
            <div className="empthy">
              <Link to="/profile">
                <img src={cloudinaryUrl} alt="User Avatar" className="user-avatar" />
              </Link>
            </div>
          ) : (
            <Link to="/login" className={`account-link ${hideAccountIcon ? 'hide' : ''}`}>
              <span ref={accountIconRef} className={`account-icon ${hideAccountIcon ? 'hide' : ''}`}>
                <AccountCircle />
              </span>
            </Link>
          )}
        </div>
      
        {requestCounter > 0 && (
          <Link to="/profile">
            <div className="notification">
              <NotificationsActiveTwoTone />
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
