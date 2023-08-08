import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../actions/userAction';
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
  TextField } from '@mui/material';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';

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


  const handleCreateTask = async () => {
    try {
      const taskData = {
        title: taskTitle,
        description: taskDescription,
        resultExpectation: taskResult,
        endDate: endDate, // Added the endDate property
        status: 'pending',
        workerId: selectedWorkerId,
      };

      const res = await axios.post('/api/v1/tasks', taskData);
      handleSnackbarOpen()
      // Close the popup after successful task creation
      setTaskPopupOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
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
                <td>{formatDate(worker.takenAt)}</td>
                
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
      label="End Date"
      type="date"
      fullWidth
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      InputLabelProps={{
        shrink: true,
      }}
    />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskPopupOpen(false)} color="secondary">
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