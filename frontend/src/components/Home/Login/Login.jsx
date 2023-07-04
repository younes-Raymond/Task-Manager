import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { loginUser
 }
from '../../../actions/userAction';
import axios from 'axios';
import './Login.css';

// localStorage.clear()

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // add local state for user data
  const [loading, setLoading] = useState(false); // add loading state
  const dispatch = useDispatch();
  const [newStatus, setNewStatus] = useState(null);
  const reqParentRef = useRef(null);
  const [requestProcessed, setRequestProcessed] = useState(false);
  const [logout, setLogout] = useState(false);
  const navigate = useNavigate();

const LogoutButton = () => {
    const handleLogout = () => {
      // Clear the localStorage
      localStorage.clear();
        window.location.reload();
    };
    handleLogout()
  }

  // const location = useLocation();
  const checkLocalStorage = () => {
    const userData = localStorage.getItem('requestData');
    const formGroups = document.querySelectorAll('.login-form .form-group');
    const loginButton = document.querySelector('.login-form button');
    const loginPage = document.querySelector('.login-form');
    const h2_Login = document.querySelector('.login-form h1');
    
    if (userData) {
      // console.log('User data found in local storage:', userData);
      setUser(JSON.parse(userData));
      formGroups.forEach((group) => group.classList.add('hide'));
      loginButton.classList.add('hide');
      loginPage.classList.add('full-width');
      h2_Login.classList.add('hide');
  
      // Clear the interval if user data is found
      clearInterval(interval);
    } else {
      // console.log('User data not found in local storage');
      formGroups.forEach((group) => group.classList.remove('hide'));
      loginButton.classList.remove('hide');
      loginPage.classList.remove('full-width');
    }
  };
  let interval;
  
  useEffect(() => {
    interval = setInterval(checkLocalStorage, 1000); // execute the hook every 1 second
    return () => clearInterval(interval); // clear the interval when the component unmounts
  }, []);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser(email, password);
      if (response && response.data && response.data.requestData && response.data.requestData.user) {
        const user = response.data.requestData.user; 
        clearInterval(interval);
        setUser(user);
        alert('im here 76')
        navigate('/');
      } else {
        alert('im here 79')
        navigate('/');
        console.log('im here')
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
  
  useEffect(() => {
    const storedStatus = localStorage.getItem('newStatus');
    if (storedStatus) {
      setNewStatus(storedStatus);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('is checking right now')
      const storedStatus = localStorage.getItem('newStatus');
      if (storedStatus === 'Request rejected' || storedStatus === 'Request approved') {
        const approvalButtons = document.getElementById('approval-buttons-id');
        const chosseContainer = document.querySelector('.chosse-containerr');
        const hint = document.querySelector('.hint');
        if (approvalButtons&& chosseContainer && hint) {
          approvalButtons.classList.add('hide');
          chosseContainer.classList.add('hide');
          hint.classList.add('hide');
        }
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  
  function handleApprove() {
    const user = JSON.parse(localStorage.getItem('user'));
    const requestDataLS = JSON.parse(localStorage.getItem('requestData'));
    const status = 'approved';
    const requestData = {
      user,
      status,
      requestDataLS
    };
    axios.post('/api/v1/approve', requestData)
      .then(response => {
        if (response.data.message === 'Request approved') {
          removeReqParent()
          console.log('Yes, it is approved.');
          setNewStatus('Request approved');
          localStorage.setItem('newStatus', 'Request approved');
          removeReqParent()
        }
        console.log("user: ", response.data);
      })
      .catch(error => {
        // Handle the error if needed
        console.error(error);
      });
  }

function handleReject() {
    const user = JSON.parse(localStorage.getItem('user'));
    const status = 'rejected';
    const requestData = {
      user,
      status,
    };
    axios
      .post('/api/v1/reject', requestData)
      .then(response => {
        console.log(response.data.message);
        if (response.data.message === 'Request rejected') {
          console.log('Yes, it is rejected.');
          setNewStatus('Request rejected');
          localStorage.setItem('newStatus', 'Request rejected');
          removeReqParent()
        }

      })
      .catch(error => {
        console.error(error);
      });
  }


  const removeReqParent = () => {
    if (reqParentRef.current) {
      reqParentRef.current.remove();
    }
  };
  

  useEffect(() => {
    const storedStatus = localStorage.getItem('newStatus');
    if (storedStatus) {
      setNewStatus(storedStatus);
    }
    
    if (requestProcessed && reqParentRef.current) {
      reqParentRef.current.remove();
    }
  }, [requestProcessed]);
  

  const handleConfirm = async () => {
    try {
      const response = await axios.post('api/v1/confirm', user.requestData);
      console.log('Confirmation sent successfully:', response.data);
      if(response.data) {
        alert('im here 241')
        navigate('/search');
      }  else {
        navigate('/search');
        console.log('im here')

      }
    } catch (error) {
      console.error('Error sending confirmation:', error);
      alert('im here 222')
      navigate('/search');

    }
 
  };

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
{/*  */}

{/*  */}

{/*  */}


        {!loading && user && (
          <div className="chosse-container">
           {user && user.requestData && user.requestData.user && (
  <div className="welcome-user">
    {/* <img src={user.requestData.user.avatar && user.requestData.user.avatar.url} alt="" cla/> */}
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

            <div ref={reqParentRef}  id="req">         
            {user.requestData.message && (
              <p className='hint'>
                <span>Hint:</span>
                {user.requestData.message}!
              </p>
            )}



{!loading && user && user.requestData && user.requestData.takenRequest && (
  <div className="chosse-containerr" id='parent-info'>
    {/* ... */}
    {user.requestData.takenRequest.requesterAvatar && user.requestData.takenRequest.requesterName && (
    <div className="requester_info">
     <div className="info">
      <p>requestDate: {user.requestData.takenRequest.requesterName}
      <span>Name: {new Date (user.requestData.takenRequest.requestDate).toLocaleDateString('ar', options)  }</span>
      <br />
      </p>
     </div>
     <img src={user.requestData.takenRequest.requesterAvatar} alt="Name of requester" className='requester-avatar' />
  </div>
    ) 
    }
    {user.requestData.takenRequest && user.requestData.takenRequest.materialPicture && user.requestData.takenRequest.requestDate && (
      <div className='material-infoo'>
        <p>
          <span>At: {new Date(user.requestData.takenRequest.requestDate).toLocaleDateString('ar', options)}</span>
        </p>
        <img src={user.requestData.takenRequest.materialPicture} alt="material picture" />
      </div>
    )}
    {/* ... */}
  </div>
)}


{/*  */}

{/*  */}

{/*  */}


            {user.requestData.takenRequest && (
              <div className="approval-buttons" id='approval-buttons-id'>
                <button onClick={handleApprove} className="approve-button">Approved</button>
                <button onClick={handleReject} className="reject-button">Rejected</button>
              </div>
            )}
          </div>
          
          {user.requestData.message && user.requestData.message.includes("approved") && (
  <div className="confirmation">
    {console.log("Yes")}
    <h4>
      Are you get the material or not? Please Confirm or click{" "}
      <span style={{ color: "orange" }}>"Not Yet".</span>
    </h4>
    <button
    onClick={handleConfirm}
      style={{ backgroundColor: "green" }}
      className="confirm-button"
      
    >
      Confirm
    </button>
    <button
      style={{ backgroundColor: "orange" }}
      className="not-yet-button"
    >
      Not Yet
    </button>
  </div>
)}
{user.requestData &&  ( 
<button className="fb-logout-button" 
style={{background : "gray", width: "20%", margin : "5% 0"}} 
onClick={LogoutButton}>
  LogOut
</button>
)}
</div>



        )}
        {loading && <p>Loading...</p>}
       
      </form>
    </div>
  );
  
}

export default LoginPage;