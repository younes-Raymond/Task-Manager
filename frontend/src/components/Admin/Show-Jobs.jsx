import React, { useEffect, useState } from 'react';
import { getAllJobs } from '../../actions/userAction';
import './Show-workers.css'
import SideBar from './SideBar/SideBar'
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import axios from 'axios';
import Loading from '../Layouts/loading'
import { formatDate } from '../../utils/DateFormat';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

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

  if (!Jobs.length) {
      return <SideBar />
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
            <th>Title</th>
            <th>Description</th>
            <th>Requirements</th>
            <th>Applied</th>
            <th>Workers who Applicant:</th>
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
              {job.applicants && job.applicants.length > 0? (
  <ul>
    {job.applicants.map((applicant, index) => (
      <li key={index} className='applicant'>
        <a href={applicant.file} download target='_blanck'>
        <label htmlFor=""><PictureAsPdfIcon /> :</label>
          {applicant.name} ({applicant.email})
        </a>
      </li>
    ))}
  </ul>
) : (
  'N/A'
)}
              </td>
              <td>{formatDate(job.createdAt)}</td>

              <td className='Edit-Delete-container'>
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
