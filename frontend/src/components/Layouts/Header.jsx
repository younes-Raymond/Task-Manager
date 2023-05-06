import { Link } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';
import Searchbar from './Searchbar';
import logo from '../../assets/images/logo.png';
import './Header.css';

const Header = () => {
  return (
    <header className="Header">
      <div className="container">
        <div className="logo-search-bar-container">
          <Link className="" to="/">
            <img draggable="false" className="" src={logo} alt="AllMart Logo" id="logo" />
          </Link>
          <Searchbar />
        </div>
        <div className="login-icon-container">
          <Link to="/login">
            <AccountCircle />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;