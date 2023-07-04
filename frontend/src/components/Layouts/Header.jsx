import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';
import Searchbar from './Searchbar';
import logo from '../../assets/images/logo.png';
import './Header.css';

const Header = () => {
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');
  const [hideAccountIcon, setHideAccountIcon] = useState(false);
  const accountIconRef = React.useRef(null);

  useEffect(() => {
    const checkLocalStorage = () => {
      const avatarUrl = localStorage.getItem('avatar');
      if (avatarUrl) {
        accountIconRef.current.style.display = 'none';
        setCloudinaryUrl(avatarUrl);
        setHideAccountIcon(true);
      }
    };
    let interval;
    if (!hideAccountIcon) {
      console.log('Checking local storage'); 
      interval = setInterval(checkLocalStorage, 100);
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
            <Link to="/login" >
            <img src={cloudinaryUrl} alt="User Avatar" className="user-avatar" />
            </Link>
          ) : (
            <Link to="/login" className={`account-link ${hideAccountIcon ? 'hide' : ''}`}>
              <span ref={accountIconRef} className={`account-icon ${hideAccountIcon ? 'hide' : ''}`}>
                <AccountCircle />
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
