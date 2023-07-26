import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Navigate} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import './profile.css';
import Loading from '../../Layouts/loading';
import HomeIcon from '@mui/icons-material/Home';
import HandymanIcon from '@mui/icons-material/Handyman';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { formatDate } from '../../../utils/DateFormat';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
function ProfilePage() {

  const [user, setUser] = useState(null); 
  const [reQSrV, setReQSrV] = useState(null);
  const [loading, setLoading] = useState(false); 
  const dispatch = useDispatch();
  const [newStatus, setNewStatus] = useState(null);
  const reqParentRef = useRef(null);
  const [requestProcessed, setRequestProcessed] = useState(false);
  const navigate = useNavigate();
  const profileImg  = localStorage.getItem('avatar')
  const name = localStorage.getItem('name')
  const [intervalId, setIntervalId] = useState(null);

  const refreshInterval = 3000;

const LogoutButton = () => {
    const handleLogout = () => {
      // Clear the localStorage
      localStorage.clear();
        navigate('/login')
        window.location.reload()
    };
    handleLogout()
  }
  
  const checkLocalStorage = () => {
    const userData = localStorage.getItem('requestData');
    const User = localStorage.getItem('user');
    if (userData) {
      setReQSrV(JSON.parse(userData));
    }
    if(User){
      setUser(JSON.parse(User));
    }
  };

  const getMaterialRequests = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post('/api/v1/getReguests', user);
      const requestData = response.data.requestData;
      if(response.data.requestData){
      localStorage.setItem('requestData', JSON.stringify(requestData));
      localStorage.setItem('name', response.data.requestData.user.name);
      localStorage.setItem('userIdLS', response.data.requestData.user._id); 
      localStorage.setItem('avatar', response.data.requestData.user.avatar.url);
    } else {
      console.log('no data come from server ')
    }
    } catch (error) {
      console.error('Error fetching material requests:', error);
    }
  };
  

const refreshData = () => {
  checkLocalStorage();
  getMaterialRequests();
  if (localStorage.getItem('requestData')) {
    clearInterval(intervalId);
  }
};

useEffect(() => {
  const interval = setInterval(refreshData, refreshInterval);
  setIntervalId(interval);
  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const chooseContainer = document.querySelector('.chosse-container');
    if (chooseContainer) { 
      if (user) {
        chooseContainer.classList.add('show');
      } else {
        chooseContainer.classList.remove('show');
      }
    }
  }, [user]);

  useEffect(() => {
    const storedStatus = localStorage.getItem('newStatus');
    if (storedStatus) {
      setNewStatus(storedStatus);
    }
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
          setNewStatus('Request approved');
          document.getElementById('req').remove()
          localStorage.setItem('newStatus', 'Request approved');
          localStorage.removeItem('requestData');

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
          document.getElementById('req').remove()
          setNewStatus('Request rejected');
          localStorage.setItem('newStatus', 'Request rejected');
          localStorage.removeItem('requestData');

        }
      })
      .catch(error => {
        console.error(error);
      });
  }

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
      const response = await axios.post('api/v1/confirm', reQSrV);
      console.log('Confirmation sent successfully:', response.data);
      if (response.data && response.data.message === 'Material request confirmed successfully') {
        const confirmationElement = document.querySelector('.confirmation');
        if (confirmationElement) {
          confirmationElement.style.visibility = 'hidden';
        }
        localStorage.removeItem('requestData');
      }
    } catch (error) {
      console.error('Error sending confirmation:', error);
      // Handle the error if needed
    }
  };
  
  
  return (
    <div className="Profile-container">
      <div className="profile-cover">
        <img src={profileImg} alt="" className='cover-img' />
        <div className="profile-circle">
          <img src={profileImg} alt="" /> 
        </div>
        <div className="edit-btn">
           <CameraAltIcon />
           </div>
      </div>
  
      <div className="name">
        {name}
      </div>
      <div className="User-container">
        {user && (
          <div className="chosse-container">
            {user.gender && (
              <div className="welcome-user">
                <p>
                  Welcome back,
                  {user.gender === "female" && " Ms "}
                  {user.gender === "male" && " Mc "}
                  {user.name}! What would you like to visit first?
                </p>
              </div>
            )}
            {user.role === 'admin' && (
              <div className="dashboard">
                <Link to="/admin/dashboard">
                  <button>Dashboard <br /><DashboardCustomizeIcon /></button>
                </Link>
              </div>
            )}
            
            <div className="materials">
              <Link to="/show-products">
                <button>
                  قاءمة المعدات<br />
                  <HandymanIcon />
                </button>
              </Link>
            </div>

            <div className="materials">
              <Link to="/">
                <button>
                  Home <br />
                  <HomeIcon />
                </button>
              </Link>
            </div>

            <div ref={reqParentRef} id="req">
              {reQSrV && (
                <p className='hint'>
                  <span>Hint:</span>
                  {reQSrV.message}!
                </p>
              )}
  
              {reQSrV && reQSrV.takenRequest && (
                <div className="chosse-containerr" id='parent-info'>
                  {/* ... */}
                  {reQSrV.takenRequest && reQSrV.takenRequest.requesterAvatar && reQSrV.takenRequest.requesterName && (
                    <div className="requester_info">
                      <div className="info">
                        <p> Name: {reQSrV.takenRequest.requesterName} <br />
                        <span> Date : {formatDate(reQSrV.takenRequest?.requestDate) }</span>
                        <br />
                        </p>
                      </div>
                      <img src={reQSrV.takenRequest?.requesterAvatar} alt="Name of requester" className='requester-avatar' />
                    </div>
                  )}
                  {reQSrV.takenRequest && reQSrV.takenRequest?.materialPicture && reQSrV.takenRequest?.requestDate && (
                    <div className='material-infoo'>
                      <p>
                        <span>At: {formatDate(reQSrV.takenRequest?.requestDate)}</span>
                      </p>
                      <img src={reQSrV.takenRequest?.materialPicture} alt="material picture" />
                    </div>
                  )}
                  {/* ... */}
                </div>
              )}
  
              {reQSrV?.takenRequest && (
                <div className="approval-buttons" id='approval-buttons-id'>
                  <button onClick={handleApprove} className="approve-button">Approved</button>
                  <button onClick={handleReject} className="reject-button">Rejected</button>
                </div>
              )}
            </div>
  
            {/* ... */}
          </div>
        )}
  
        {/* ... */}
      </div>
  
      {reQSrV?.message && reQSrV?.message.includes("approved") && (
        <div className="confirmation">
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
  
     
        <button className="fb-logout-button"
          style={{ background: "gray", width: "20%", margin: "5% 0", fontWeight: "bold" }}
          onClick={LogoutButton}
        >
          <LogoutOutlinedIcon /> Logout
        </button>

  
      {loading && <Loading />}
    </div>
  );
  
}

export default ProfilePage;