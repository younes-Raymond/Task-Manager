import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { loginUser } from '../../../actions/userAction';

import './Login.css';
localStorage.clear()

function handleApprove() {
  // Function to handle the approval action
}

function handleReject() {
  // Function to handle the rejection action
}

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
        console.log('User data found in local storage:', userData);
        setUser(JSON.parse(userData));
        clearInterval(interval);
      } else {
        console.log('User data not found in local storage');
      }
    };
    interval = setInterval(checkLocalStorage, 1000); // execute the hook every 1 second
    return () => clearInterval(interval); // clear the interval when the component unmounts
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser(email, password);
      if (response && response.data && response.data.requestData && response.data.requestData.user) {
        const user = response.data.requestData.user; // Retrieve the 'user' data from the response
        console.log('User from server:', user);
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        console.log('User data not found in response:', response);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  useEffect(() => {
    const chooseContainer = document.querySelector('.chosse-container');
    const new_user = document.querySelector('.New-user');
    if (chooseContainer) { // add null check
      if (user) {
        chooseContainer.classList.add('show');
        new_user.style = 'display:none;'
      } else {
        chooseContainer.classList.remove('show');
      }
    }
  }, [user]);

  let formattedDate = '';
  if (user && user.requestData && user.requestData.takenRequest && user.requestData.takenRequest.requestDate) {
    formattedDate = new Date(user.requestData.takenRequest.requestDate).toLocaleDateString('ar', options);
  }



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
           {user && user.requestData && user.requestData.user && (
  <div className="welcome-user">
    <img src={user.requestData.user.avatar && user.requestData.user.avatar.url} alt="" />
    <p>
      Welcome back,
      {user.requestData.user.gender === "female" && " Ms "}
      {user.requestData.user.gender === "male" && " Mc "}
      {user.requestData.user.name}! What would you like to visit first?
    </p>
  </div>
)}
            {user.requestData.user.role === 'admin' && (
              <div className="dashboard">
                <Link to="/add-material">
                  <button>Dashboard</button>
                </Link>
              </div>
            )}
            <div className="materials">
              <Link to="/show-products">
                <button>See Materials</button>
              </Link>
            </div>
            <div className="home">
              <Link to="/">
                <button>Home</button>
              </Link>
            </div>
            {user.requestData.message && (
              <p className='hint'>
                <span>Hint:</span>
                {user.requestData.message}!
              </p>
            )}
{!loading && user && user.requestData && (
  <div className="chosse-container">
    {/* ... */}
    {user.requestData.takenRequest && user.requestData.takenRequest.materialPicture && user.requestData.takenRequest.requestDate && (
      <div className='material-info'>
        <p>
          <span>At: {new Date(user.requestData.takenRequest.requestDate).toLocaleDateString('ar', options)}</span>
        </p>
        <img src={user.requestData.takenRequest.materialPicture} alt="material picture" />
      </div>
    )}
    {/* ... */}
  </div>
)}


            {user.requestData.takenRequest && (
              <div className="approval-buttons">
                <button onClick={handleApprove} className="approve-button">Approved</button>
                <button onClick={handleReject} className="reject-button">Rejected</button>
              </div>
            )}
          </div>
        )}
  
        {loading && <p>Loading...</p>}
      </form>
    </div>
  );
  

}

export default LoginPage;