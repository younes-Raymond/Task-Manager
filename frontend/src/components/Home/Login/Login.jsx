import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { loginUser } from '../../../actions/userAction';

import './Login.css';

localStorage.clear()
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // add local state for user data
  const [loading, setLoading] = useState(false); // add loading state
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    let interval;
    const checkLocalStorage = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        // console.log('User data found in local storage:', userData);
        setUser(JSON.parse(userData)); // parse the retrieved data and set the user state
        clearInterval(interval); // clear the interval when the user data is found
      }
    };
    interval = setInterval(checkLocalStorage, 1000); // execute the hook every 1 second
    return () => clearInterval(interval); // clear the interval when the component unmounts
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // set loading state to true
    try {
      const response = await dispatch(loginUser(email, password));
      const { user } = response;
      console.log('User from server:', user);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false); // set loading state to false
    }
  };
  
  useEffect(() => {
    const chooseContainer = document.querySelector('.chosse-container');
    const new_user = document.querySelector('.New-user')
    if (chooseContainer) { // add null check
      if (user) {
        chooseContainer.classList.add('show');
        new_user.style = 'display:none;'
      } else {
        chooseContainer.classList.remove('show');
      }
    }
  }, [user]);

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Login</h1>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <div className="register-link">
          <p className='New-user'>
            New to Allamrt? <Link to="/register">Register here</Link>
          </p>
        </div>
        {!loading && user && (
          <div className="chosse-container">
           <p> {console.log(user)}</p>
            <div className="welcome-user">
              <img src={user.avatar} alt="" />
              <p>Welcome back, {user.name}! What would you like to visit first?</p>
            </div>
            {user.role === 'admin' && (
              <div className="dashboard">
                <Link to="/add-product"><button>Dashboard</button></Link> 
              </div>
            )}
            <div className="materials">
              <Link to="/show-products"><button>See Materials</button></Link> 
            </div>
            <div className="home">
              <Link to="/"><button>Home</button></Link> 
            </div>
            {user.requestData.message && (
            <p className='hint'>
              <span>Hint:</span>
              {user.requestData.message}!
            </p>
          )}
          
          </div>
        )}
        {loading && <p>Loading...</p>} {/* show loading message while waiting for user data */}
      </form>
    </div>
  );
}

export default LoginPage;