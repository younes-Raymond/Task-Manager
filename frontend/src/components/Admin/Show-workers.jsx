import React, { useEffect, useState , useRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getAllUsers , uploadVideoToCloudinary} from '../../actions/userAction';
import SideBar from './SideBar/SideBar';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import axios from 'axios';
import Loading from '../Layouts/loading';
import { formatDate } from '../../utils/DateFormat';
import {   
  Avatar,
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  Button, 
  Dialog, 
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TextField,
  IconButton,
  TableCell,
  Paper,
  Snackbar, 

 } from '@mui/material';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VideocamIcon from '@mui/icons-material/Videocam';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';

import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string()
    .required('Description is required')
    .min(50, 'Description must be at least 50 characters'),
  resultExpectation: Yup.string().required('Result Expectation is required'),
  deadlineDays: Yup.date().required('Deadline is required'),
});



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
  const [editedRows, setEditedRows] = useState([]);
  const dataGridRef = useRef();


  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      resultExpectation: '',
      deadlineDays: '',
    },
    validationSchema: validationSchema, // Add the validation schema here
    onSubmit: async (values) => {
      // This function will only be called if the form passes validation
      console.log('Form submitted with values:', values);
      // Call your form submission logic here (e.g., handleCreateTask)
    },
  });
  

  const handleRowEditCommit = React.useCallback(
    async (params) => {
      const id = params.id;
      const key = params.field;
      const value = params.value;
  
      // Create an object containing the edited data
      const editedData = {
        id: id,
        field: key,
        value: value,
      };
  
      // Deep copy the editedData to remove any circular references
      const copiedData = JSON.parse(JSON.stringify(editedData));
  
      handleSaveChanges(copiedData);
  
      // Return the edited data
      return editedData;
    },
    []
  );
  
  const handleSaveChanges = async (data) => {
    try {
      const response = await axios.post('/api/v1/editworker', data);
      console.log('Data saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  
  

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
  let isMounted = true;

  const fetchWorkers = async () => {
    try {
      const data = await getAllUsers();
       console.log(data.users)// this is log undifined how to deal with this probleme right now 
      const updatedRows = data.users.map((user, index) => ({
        id: user._id, // Assign a unique ID based on the index
        fullName: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
        gender: user.gender,
        role: user.role,
        registerAt: formatDate(user.registerAt),
        avatar: user.avatar.url,
      }));

      if (isMounted) {
        setWorkers(updatedRows);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchWorkers();

  return () => {
    isMounted = false;
  };
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



const columns = [
  // { field: 'id', headerName: 'ID', width: 0 },
  {
    field: 'avatar',
    headerName: 'Avatar',
    width: 80,
    height:80,
    margin:5,
    renderCell: (params) => (
      <div style={{ width: '90%', height: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Avatar
          src={params.value} 
          alt=""
          style={{ width: '80px', height: '80px', maxWidth: '100%', maxHeight: '100%', borderRadius: '50%' }}
        />
      </div>
    ),
    
  },
  { field: 'fullName', headerName: 'Full name', width: 140} ,
  { field: 'phoneNumber', headerName: 'phone', width: 150 , editable: true},
  { field: 'email', headerName: 'Email', width: 200, editable: true  },
  { field: 'gender', headerName: 'Gender', width: 100 },
  { field: 'role', headerName: 'Role', width: 100, editable: true },
  { field: 'registerAt', headerName: 'Registered At', width: 150 },

  
  {
    field: 'actions',
    headerName: 'Actions',
    width: 100,
    renderCell: (params) => (
      <div>
<IconButton onClick={() => handleDelete(params.id)} color="secondary">
  <Delete />
</IconButton>
<IconButton onClick={() => handleSelectWorker(params.id)} color="primary">
  <AddTaskRoundedIcon />
</IconButton>


      </div>
    ),
  },


  
];





return (
  <div className='wrapper'>

  <SideBar />


  <Box  style={{ height: '600px', width: '100%', padding: '20px' }}>

  <DataGrid
  onCellEditCommit={handleRowEditCommit}
          rows={workers}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10]}
          ref={dataGridRef}
          checkboxSelection
          pagination
        />
<IconButton>
<Button
  variant='contained'
  color='primary'
  style={{marginTop:'16px'}}  
  onClick={handleSaveChanges}
  ><SaveIcon /> Save
  </Button>
</IconButton>
     
  </Box>
      

<Dialog open={isTaskPopupOpen} onClose={() => setTaskPopupOpen(false)}>
  <DialogTitle> Create Task</DialogTitle>

  <DialogContent>
    <form onSubmit={formik.handleSubmit}>
      <TextField
        label="Task Title"
        fullWidth
        multiline
        name="title"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
        style={{ marginBottom: '16px' }}
      />
      <TextField
        label="Task Description"
        fullWidth
        multiline
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
        inputProps={{minLength: 50, maxLength: 200 }}
        style={{ marginBottom: '16px' }}
      />
      <TextField
        label="Task Result Expectation"
        fullWidth
        multiline
        name="resultExpectation"
        value={formik.values.resultExpectation}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.resultExpectation && Boolean(formik.errors.resultExpectation)}
        helperText={formik.touched.resultExpectation && formik.errors.resultExpectation}
        style={{ marginBottom: '16px' }}
      />
      <TextField
        label="DeadLine"
        type="date"
        fullWidth
        name="deadlineDays"
        value={formik.values.deadlineDays}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        InputLabelProps={{
          shrink: true,
        }}
        error={formik.touched.deadlineDays && Boolean(formik.errors.deadlineDays)}
        helperText={formik.touched.deadlineDays && formik.errors.deadlineDays}
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
                marginTop: '16px',
              }}
            />
          ) : null}
        </Grid>

        <Grid item>
          {stream && (
            <Button
              variant="contained"
              color="primary"
              type="submit" // Add type to trigger form submission
              style={{ marginLeft: '8px' }}
            >
              <SendIcon />
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  </DialogContent>





<DialogActions>
  <Button onClick={() => { setTaskPopupOpen(false); stopCamera(); }} color="secondary">
    Cancel
  </Button>

  {formik.values.title && formik.values.description && formik.values.resultExpectation && formik.values.deadlineDays ? (
    <Button
      onClick={handleCreateTask}
      color="primary"
      type="submit" // Add type to trigger form submission
    >
      Create Task
    </Button>
  ) : (
    <Button
      disabled // Disable the button if any of the required fields is empty
      color="primary"
    >
      Create Task
    </Button>
  )}
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