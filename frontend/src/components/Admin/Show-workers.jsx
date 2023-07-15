import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../actions/userAction';
import './Show-workers.css'
import SideBar from './SideBar/SideBar'
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import axios from 'axios';
import Loading from '../Layouts/loading'
import { formatDate } from '../../utils/DateFormat';

const ShowWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

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
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowWorkers;