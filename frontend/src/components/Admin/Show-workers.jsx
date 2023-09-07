import React, { useEffect, useState , useRef } from 'react';
import { getAllUsers , uploadVideoToCloudinary} from '../../actions/userAction';
import './Show-workers.css';
import SideBar from './SideBar/SideBar';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import axios from 'axios';
import Loading from '../Layouts/loading';
import { formatDate } from '../../utils/DateFormat';
import {   
  Snackbar, 
  Alert,
  Dialog, 
  DialogTitle,
  DialogContent,
  DialogActions,
  Button, 
  TextField,
  IconButton,
  Card,
  CardContent,
  Grid,
  Typography,
 } from '@mui/material';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VideocamIcon from '@mui/icons-material/Videocam';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
const ShowWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTaskPopupOpen, setTaskPopupOpen] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskResult, setTaskResult] = useState('');
  const [endDate , setEndDate ] = useState('');
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [taskImages, setTaskImages] = useState([]); 
  const [taskVideo, setTaskVideo] = useState(null); 
  const [stream, setStream] = useState(null)
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [iconColor, setIconColor] = useState({ camera: 'default', upload: 'default' , video:'default'});
  

  const handleIconColor = (iconType) => {
    const defaultColors = { camera: 'default', upload: 'default', video: 'default' };
  
    const newIconColor = { ...defaultColors };
  
    newIconColor[iconType] = 'primary';
  
    setIconColor(newIconColor);
  };

  const handleCreateTask = async () => {
    console.log('start create Task function :');
    try {
      const formData = new FormData();
      formData.append('title', taskTitle);
      formData.append('description', taskDescription);
      formData.append('resultExpectation', taskResult);
      formData.append('deadlineDays', endDate);
      formData.append('status', 'pending');
      formData.append('workerId', selectedWorkerId);

    

      if (fileInputRef.current.files.length > 0) {
        formData.append('file', fileInputRef.current.files[0]);
      }
      for (let i = 0; i < taskImages.length; i++) {
        formData.append('taskImages', taskImages[i]);
      }
  
      if (taskVideo) {
        // Convert the base64 string to a Blob
        const videoBlob = new Blob([new Uint8Array(atob(taskVideo).split('').map(char => char.charCodeAt(0)))], { type: 'video/webm' });
        formData.append('taskVideo', videoBlob, 'video.webm');
      }
  
      const res = await axios.post('/api/v1/tasks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(res.data);
      handleSnackbarOpen();
      // Close the popup after successful task creation
      setTaskPopupOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  
  
const handleFileInputChange = (e) => {
  // Stop the camera before processing the file input
  stopCamera();
  
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    console.log(`Selected file: ${selectedFile.name}`);
    // Change the icon color to blue sky for upload icon
    handleIconColor('upload');
  }
};

  
  useEffect(() => {
    const fetchWorkers = async () => {
      const data = await getAllUsers();
      console.log(data)
      setWorkers(data.users);
      setLoading(false);
    };
    fetchWorkers();
  }, []);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/users/${id}`);
      setWorkers(workers.filter((worker) => worker._id!== id));
    } catch (error) {
      console.log(error);
    }
  };


 const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSelectWorker = (workerId) => {
    setSelectedWorkerId(workerId);
    setTaskPopupOpen(true);
  };

 const handleCaptureImage = async () => {
  handleIconColor('camera');
  try {
    startCamera();
    recordVideo(false);
  } catch (error) {
    console.error('Error capturing image:', error);
  }
};

  
  

  const handleRecordVideo = async () => {
handleIconColor("video")
    try {
      const videoBlob = await recordVideo(true);
      console.log('Video Blob:', videoBlob);
  
      // Convert videoBlob to base64 string
      const reader = new FileReader();
      reader.onload = () => {
        const videoBase64 = reader.result.split(',')[1]; // Extract the base64 part
        // Set the captured video base64 string as taskVideo
        setTaskVideo(videoBase64);
      };
      reader.readAsDataURL(videoBlob);
     
      stopCamera();
    } catch (error) {
      console.error('Error recording video:', error);
    }
  };
  


  const recordVideo = async (includeAudio) => {
    try {
     
      const constraints = {
        video: true,
        audio: includeAudio, // Set audio based on the parameter
      };
  
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
  
      const recordedChunks = []; // To store video chunks
  
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
  
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
  
      if (canvas && context) {
        canvas.style.display = 'block';
  
        const videoElement = document.createElement('video');
        videoElement.srcObject = mediaStream;
  
        videoElement.onloadedmetadata = () => {
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
  
          const drawFrame = () => {
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            requestAnimationFrame(drawFrame);
          };
  
          videoElement.play(); // Start playing the video
          drawFrame(); // Start drawing frames
  
          // Start recording
          mediaRecorder.start();
        };
  
        videoElement.onerror = (error) => {
          mediaStream.getTracks().forEach((track) => track.stop());
          console.error('Error loading video:', error);
        };
      }

  
      return new Promise((resolve, reject) => {
        mediaRecorder.onstop = () => {
          const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
          resolve(videoBlob);
        };
  
        mediaRecorder.onerror = (error) => {
          reject(error);
        };
  
        setTimeout(() => {
          mediaRecorder.stop();
        }, 10000); // Stop recording after 10 seconds
      });
    } catch (error) {
      console.error('Error starting camera:', error);
      throw error;
    }
  };
  
const startCamera = async () => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    setStream(mediaStream);

    // Set the icon color to primary when the camera is open
    setIconColor((prevState) => ({ ...prevState, camera: 'primary' }));
  } catch (error) {
    console.error('Error starting camera:', error);
  }
};


const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    setStream(null);

    // Set the icon color back to default when the camera is stopped
    setIconColor('default');
  }
};



  return (
    <div className='wrapper'>
  <SideBar />
      {loading? (
        <Loading />
      ) : (
        <table className="table-container">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Role</th>
              <th>Image</th>
              <th>Registered At</th>
              <th>Modification</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr key={worker._id}>
                <td>{worker.name}</td>
                <td>{worker.email}</td>
                <td>{worker.gender}</td>
                <td>{worker.role}</td>
                <td>
                  <img src={worker.avatar.url} alt="" />
                  </td>
                <td>{formatDate(worker.registerAt)}</td>

                <td className='Edit-Delete-container'>
                <button className='Edit'>
                    Edit:
                        <Edit /> 
                    </button>
                <button className='Delete' onClick={() => handleDelete(worker._id)}>
                    Delete:
                    <Delete />
                </button>   
                <button onClick={() => handleSelectWorker(worker._id)} id='Task-btn'>TasK:<br />
  <AddTaskRoundedIcon /> 
</button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      
      <Dialog open={isTaskPopupOpen} onClose={() => setTaskPopupOpen(false)}>
  <DialogTitle> Create Task</DialogTitle>
  <DialogContent>
    <TextField
      label="Task Title"
      fullWidth
      multiline
      value={taskTitle}
      onChange={(e) => setTaskTitle(e.target.value)}
      style={{ marginBottom: '16px' }}
    />
    <TextField
      label="Task Description"
      fullWidth
      multiline
      value={taskDescription}
      onChange={(e) => setTaskDescription(e.target.value)}
      style={{ marginBottom: '16px' }}
    />
    <TextField
      label="Task Result Expectation"
      fullWidth
      multiline
      value={taskResult}
      onChange={(e) => setTaskResult(e.target.value)}
      style={{ marginBottom: '16px' }}
    />
    <TextField
      label="DeadLine"
      type="date"
      fullWidth
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      InputLabelProps={{
        shrink: true,
      }}
    />

    <Card>
      <CardContent>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
     
<Grid item>
  <IconButton onClick={handleCaptureImage} color={iconColor.camera}>
    <PhotoCameraIcon />
  </IconButton>
</Grid>



          <Grid item>
            <IconButton onClick={handleRecordVideo} color={iconColor.video}>
              <VideocamIcon />
            </IconButton>
          </Grid>
          <input
  type="file"
  ref={fileInputRef}
  style={{ display: 'none' }}
  onChange={handleFileInputChange}
  accept=".jpg, .jpeg, .png, .gif, .mp4 , .pdf"  
/>
<Grid item>
  <IconButton onClick={() => fileInputRef.current.click()} color={iconColor.upload}>
    <CloudUploadIcon />
  </IconButton>
</Grid>
        </Grid>
      </CardContent>
    </Card>

    <Grid container spacing={2} justifyContent="center" alignItems="center">
    <Grid item>
  {stream ? (
    <canvas
      ref={canvasRef}
      style={{
        display: stream ? 'block' : 'none',
        width: '100%',
        maxWidth: '400px',
        marginTop: '16px'
      }}
    />
  ) : null}
</Grid>


  <Grid item>
    {stream && (
    <Button
    variant="contained"
    color="primary"
    onClick={handleCreateTask}
    style={{ marginLeft: '8px' }}
  >
    <SendIcon />
  </Button>
  
    )}
  </Grid>
</Grid>



  </DialogContent>
  <DialogActions>
  <Button onClick={() => { setTaskPopupOpen(false); stopCamera(); }} color="secondary">
  Cancel
</Button>

    <Button onClick={handleCreateTask} color="primary">
      Create Task
    </Button>
  </DialogActions>
</Dialog>






      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Data sent successfully!
        </Alert>
      </Snackbar>

    </div>
  );
};

export default ShowWorkers;