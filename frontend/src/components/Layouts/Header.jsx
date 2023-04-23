import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Search from '@mui/icons-material/Search';
import Searchbar from './Searchbar';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';
import './Header.css'

const Header = () => {

  return (

    <header className="Header">

      {/* <!-- navbar container --> */}
      <div className="container">

        {/* <!-- logo & search container --> */}
        <div className="logo-search-bar-container"> 
          <Link className="" to="/" >
            <img draggable="false" className="" src={logo} alt="AllMart Logo" id='logo' />
          </Link>
          <Searchbar />
        </div>
        {/* <!-- logo & search container --> */}

      </div>
      {/* <!-- navbar container --> */}
    </header>
  )
};

export default Header;
