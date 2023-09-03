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
import SettingsSuggestTwoToneIcon from '@mui/icons-material/SettingsSuggestTwoTone';
import CheckIcon from '@mui/icons-material/Check';
import { getTasks } from '../../../actions/userAction';
import { Button, Typography, List, ListItem, ListItemText, ListItemSecondaryAction,Paper, Card, CardHeader, CardMedia, CardContent, CardActions,ListItemAvatar, Avatar } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function ProfilePage() {

  const [user, setUser] = useState(null); 
  const [reQSrV, setReQSrV] = useState(null);
  const [loading, setLoading] = useState(false); 
  const dispatch = useDispatch();
  const [newStatus, setNewStatus] = useState(null);
  const reqParentRef = useRef(null);
  const [requestProcessed, setRequestProcessed] = useState(false);
  const navigate = useNavigate();
  const [profileImg, setProfileImg ]  = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [tasks , setTasks ] = useState([]);
  const [isStartTask, setIsStartTask ] = useState(false);
  const [isTaskDone , setIsTaskDone ] = useState(false);
  const [open, setOpen] = useState(false);
 const [selectedTask, setSelectedTask] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

const fetchRequests = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.post('/api/v1/getReguests', user);
    const requestData = response.data.requestData;
    if (requestData) {
      console.log(requestData)
      setReQSrV(requestData);
    }
  } catch (error) {
    console.error('Error fetching material requests:', error);
  }
};

useEffect(() => {
  checkLocalStorage();
  fetchRequests()
  fetchTasks()
}, []);

 useEffect(() => {
    if (reQSrV && reQSrV.message) {
      setSnackbarMessage(reQSrV.message);
      setSnackbarOpen(true);
    }
  }, [reQSrV]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

const fetchTasks = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    const tasksData = await getTasks(userData._id);
    setTasks(tasksData.tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};


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

  if (User) {
    const parsedUser = JSON.parse(User);
    setUser(parsedUser);

    if (parsedUser.avatar.url) {
      setProfileImg(parsedUser.avatar.url);
    }
  }
};

const handleOpen = (task) => {
  setSelectedTask(task);
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};


function calculateRemainingTime(createdAt, deadlineDays) {
  const createdAtDate = new Date(createdAt);
  const currentDate = new Date();
  const millisecondsPerDay = 24 * 60 * 60 * 1000; 

  const timeDifference = createdAtDate.getTime() - currentDate.getTime();
  const remainingDays = Math.ceil(timeDifference / millisecondsPerDay);

  if (remainingDays > deadlineDays) {
    return `${remainingDays - deadlineDays} days remaining`;
  } else if (remainingDays === deadlineDays) {
    return `Today is the deadline`;
  } else if (remainingDays > 0) {
    return `Less than ${deadlineDays} days remaining`;
  } else {
    return `Deadline has passed`;
  }
}



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
          document.getElementById('req').remove()
          localStorage.removeItem('requestData');
          setNewStatus('Request approved')
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
      }
    } catch (error) {
      console.error('Error sending confirmation:', error);
      // Handle the error if needed
    }
  };

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  setSelectedFile(file);

  // Convert the image to base64 format
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64String = reader.result;

    // Include the base64 image data in the request
    const formData = new FormData();
    formData.append('image', base64String);
    formData.append('userId', user._id);

    try {
      // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint for image upload
      const res = await axios.post('/api/v1/updateprofileimg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if(res.data.message.includes('Image uploaded successfully')){
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(res.data.worker) )
        console.log('Image upload successful:', res.data);
        setProfileImg(res.data.worker.avatar.url);

      } else {
        alert(res.data.message);
      }
    } catch (error) {
      // Handle the error if the image upload fails
      console.error('Image upload failed:', error);
    }
  };
  reader.onerror = (error) => {
    // Handle any error that might occur during the conversion
    console.error('Image conversion failed:', error);
  };

  reader.readAsDataURL(file);
};

const handleStartTask = async (taskId) => {
  try {

    const data = { taskId }; 
    const res = await axios.post(`/api/v1/updateTasks`, data); 
    console.log('Task status updated:', res.data);
    
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, status: 'in progress' } : task
    );
    setTasks(updatedTasks);
    setIsStartTask(true);
    handleOpen(taskId)
  } catch (error) {
    console.error('Error updating task status:', error);
  }
};

const handleCompleteTask = async (taskId) => {

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const data = {
      userId: user._id,
      taskId,
      status: 'completed'
    };

    const res = await axios.post(`/api/v1/updateTasksDone`, data);
    console.log('Task status updated:', res.data);

    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, status: 'completed' } : task
    );
    setTasks(updatedTasks);
    setIsTaskDone(true);
  } catch (error) {
    console.error('Error updating task status:', error);
  }
};


return (
    <div className="Profile-container">
      {user && (
        <div className="wrap-help">
        <div className="profile-cover">
        <img src={profileImg} alt="" className='cover-img' />
        {/* {console.log(user.avatar.url)} */}
        <div className="profile-circle">
          <img src={profileImg} alt="" /> 
        </div>
        <div className="edit-btn">
      <label htmlFor="fileInput">
        <CameraAltIcon />
      </label>
      <input
        type="file"
        accept="image/*"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
    </div>
      </div>
            <div className="name">
        {user.name}
      </div>
      </div>

      )}
    
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
              <div className="dashboard ">
                <Link to="/admin/dashboard">
                  <button className='item'>Dashboard <br /><DashboardCustomizeIcon /></button>
                </Link>
              </div>
            )}
            
            <div className="materials">
              <Link to="/show-products">
                <button className='item'>
                  قاءمة المعدات<br />
                  <HandymanIcon />
                </button>
              </Link>
            </div>

            <div className="materials">
              <Link to="/">
                <button className='item'>
                  Home <br />
                  <HomeIcon />
                </button>
              </Link>
            </div>
            <div className="setting">
              <Link to="/settings">
                <button className='item'>
                  Setting <br />
                  <SettingsSuggestTwoToneIcon />
                </button>
              </Link>
            </div>

            <div ref={reqParentRef} id="req">
            <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Adjust the duration as needed
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity="info" // You can use 'error', 'warning', 'info', 'success'
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
  
<div className="requests-container">
    <Paper elevation={3} >

      {reQSrV && reQSrV.takenRequest && (
        <Card>
          <div className="requester-info">
           <ListItemAvatar>
            <Avatar alt='Name of requester' src={reQSrV.takenRequest?.requesterAvatar} />
          </ListItemAvatar>
          {reQSrV.takenRequest.requesterAvatar && reQSrV.takenRequest.requesterName && (
            <CardHeader title={`Name: ${reQSrV.takenRequest.requesterName}`} subheader={`Date: ${formatDate(reQSrV.takenRequest.requestDate)}`}  />
          )}
         </div>
          
          {reQSrV.takenRequest.materialPicture && reQSrV.takenRequest.requestDate && (
            <CardMedia component="img" src={reQSrV.takenRequest.materialPicture} alt="Product" title={`At: ${formatDate(reQSrV.takenRequest.requestDate)}`} />
          )}


          {reQSrV.takenRequest && (
            <CardActions>
              <Button onClick={handleApprove} className="approve-button" variant="contained">Approved</Button>
              <Button onClick={handleReject} className="reject-button" variant="outlined">Rejected</Button>
            </CardActions>
          )}
        </Card>
      )}
    </Paper>
    </div>

   </div>
          </div>
        )}
  
  <div className="tasks-container">
  <Typography variant="h4" gutterBottom>
    Your Tasks
  </Typography>
  {tasks.length > 0 ? (
    <List>
      {tasks
        .filter((task) => task.status !== 'completed') // Filter out completed tasks
        .map((task) => (


          <ListItem key={task._id} divider>
          <ListItemText
          id='Task-text'
            primary={task.title}
            secondary={
              <div>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ maxHeight: '40px', overflow: 'hidden' }} 
                >
                <strong>Description:</strong> {task.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: {task.status}
                </Typography>
              </div>
            }
            primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
          />
          {task.status === 'pending' && (
            <ListItemSecondaryAction>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen(task)}
              >
                Start Task
              </Button>
            </ListItemSecondaryAction>
          )}
          {task.status === 'in progress' && (
            <ListItemSecondaryAction>
              <Button
                variant="contained"
                style={{ backgroundColor: '#4caf50', color: 'white' }}
                onClick={() => handleCompleteTask(task._id)}
              >
                Done
                <CheckIcon style={{ marginLeft: '8px' }} />
              </Button>
            </ListItemSecondaryAction>
          )}
        </ListItem>


        ))}
    </List>
  ) : (
    <Typography variant="body2">No tasks available.</Typography>
  )}
</div>

<Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
  <DialogTitle>Task Details</DialogTitle>
  <DialogContent>
  {selectedTask && (
    <div>
      <Typography variant="h6" gutterBottom>
        Task Details
      </Typography>

      <div>
        <Typography variant="subtitle1">
          <strong>Title:</strong> {selectedTask.title}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Description:</strong> {selectedTask.description}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Expectation:</strong> {selectedTask.expectation}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Created At:</strong> {selectedTask.createdAt && formatDate(selectedTask.createdAt)}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Deadline:</strong> {selectedTask.deadlineDays} days from now
        </Typography>
        <Typography variant="subtitle1">
          <strong>
            Time Remaining: {calculateRemainingTime(selectedTask.createdAt, selectedTask.deadlineDays)}{' '}
            <AccessTimeIcon style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
          </strong>
        </Typography>
      </div>

      {selectedTask.video && (
        <div>
          
          <video controls width="100%">
            <source src={selectedTask.video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  )}
</DialogContent>

  <DialogActions>
    <Button onClick={() => handleStartTask(selectedTask?._id)} variant="contained" color="primary" startIcon={<PlayCircleFilledIcon />}>
      Start Task
    </Button>
    <Button onClick={handleClose} variant="outlined" color="primary" startIcon={<CloseIcon />}>
      Close
    </Button>
  </DialogActions>
</Dialog>


</div>

      <div className="confirm-container">
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
  </div>
     
        <button className="logout-btn"
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