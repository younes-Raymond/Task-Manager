import React, { useEffect, useState } from 'react';
import { getAllJobs } from '../../actions/userAction';
import './Show-workers.css'
import SideBar from './SideBar/SideBar'
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import axios from 'axios';
import Loading from '../Layouts/loading'

const ShowMaterials = () => {
  const [Jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await getAllJobs();
      console.log(res.data)
      setJobs(res.data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  if (!Jobs.length || loading) {
    return (
      <div>
      <SideBar />
      <Loading />
      </div>
    ) 
   }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/job/${id}`);
      setJobs(Jobs.filter((material) => material._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

 

  return (
    <div className='wrapper'>
      <SideBar />
      <table className="table-container">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Requirements</th>
            <th>Counter</th>
            <th>Applicant</th>
            <th>Created At</th>
            <th>Modification</th>
          </tr>
        </thead>
        <tbody>
          {Jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.title}</td>
              <td>{job.description}</td>
              <td>{job.requirements.join(', ')}</td>
              <td>{job.counter}</td>
              <td>
                {job.applicants && job.applicants.length > 0 ? (
                  <ul className='applicants'>
                    {job.applicants.map((applicant, index) => (
                      <li key={index}>{applicant.name} ({applicant.email})</li>
                    ))}
                  </ul>
                ) : (
                  'N/A'
                )}
              </td>
              <td>{job.createdAt}</td>

              <td>
                <button className='Edit'>
                  Edit:
                  <Edit />
                </button>
                <button className='Delete' onClick={() => handleDelete(job._id)}>
                  Delete:
                  <Delete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowMaterials;
