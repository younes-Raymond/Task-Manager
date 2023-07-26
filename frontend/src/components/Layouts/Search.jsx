import React, { useEffect, useState } from 'react';
import './Search.css'
import NotFound from '../NotFound';
import { getProducts, sendRequest, updateProduct } from '../../actions/productaction';
import MARKER from '../../assets/images/G-M-Marker.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import '../Home/ProductDetailPage.css'; 
import axios from 'axios'

const Search = () => {
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [detailsVisibility, setDetailsVisibility] = useState({});
  const [ filteredJobs, setFilteredJobs ] = useState({});

  
  useEffect(() => {
    const fetchData = () =>{
      const storedData = localStorage.getItem('result');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setFilteredMaterials(parsedData.materials || []);
        setFilteredUsers(parsedData.users || []);
        setFilteredJobs(parsedData.Jobs || []);
      }
    }  
    fetchData()
  });


  const handleOpenClose = async (materialId, userId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId_of_Taken = document.querySelector('.user-id').textContent;
  const email = user.email;
  const name = user.name;
  const userIdLS = localStorage.getItem('userIdLS');
  const destination = 'morocco';
    console.log('handle open close', materialId, userId);
    if (name && destination && email && userIdLS && userId_of_Taken) {
      alert('yes ')
      try {
        const response = await sendRequest(materialId, name, destination, email, userIdLS, userId_of_Taken)
      console.log('this is the response: ', response);
    } catch(error) {
      console.log(error);
    }
  };
};

  const handleToggleDetails = (materialId) => {
    setDetailsVisibility((prevDetails) => ({
      ...prevDetails,
      [materialId]: !prevDetails[materialId],
    }));
  };

  return (
    <div>
      <div className="materials-container">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <div className="material" key={material._id}>
              <div className="material-image">
                <img src={material.images.url} alt="Material" />
              </div>
              <div
            className={`moreLessIcon ${detailsVisibility[material._id] ? 'less' : 'more'}`}
            onClick={() => handleToggleDetails(material._id)}
          >
            {detailsVisibility[material._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
              <div className={`material-info ${detailsVisibility[material._id] ? 'show' : 'hide'}`}>
                <strong>{material.name}</strong>
                <p>{material.description}</p>
                <p>Category: {material.category}</p>
                <label htmlFor="stock">
                  Stock:
                  <span className={`counter ${material.stock > 0 ? 'green' : 'red'}`}>
                    {material.stock}
                  </span>
                </label>
              <div className="users-container">
                <h4>Workers who currently have this material</h4>
                <ul>
                  {material.users.map((user, index) => (
                    <li key={index}>
                      <button onClick={() => handleOpenClose(material._id, user._id)}>Send Request</button>
                      <p>Name: {user.name}</p>
                      <p>Destination: {user.destination}</p>
                      <p>Email: {user.email}</p>
                      <p>Taken at: {new Date(user.takenAt).toLocaleString()}</p>
                      <p className="user-id" style={{ display: 'none' }}>{user._id}</p>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${user.latitude},${user.longitude}`} target="_blank" rel="noopener noreferrer">
                        <img src={MARKER} className="Marker-G-Mps" alt="" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              </div>
               <div className={`light ${material.stock > 0 ? 'green' : 'red'}`}>
      {material.stock > 0 ? (
        <div><ThumbUpIcon style={{ display: 'inline-block' }} /></div>
      ) : (
        <div><ThumbDownAltIcon style={{ display: 'inline-block' }} /></div>
      )}
    </div>
            </div>
          ))
        ) : (
          <div>
            {/* No materials found.
            <NotFound />  */}
          </div>
        )}
      </div>
      <div className="user-container">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div className="user-item" key={user._id}>
              <div className="avatar-container">
                <img src={user.avatar.url} alt="User Avatar" />
              </div>
              <div className="user-details">
                <strong>{user.name}</strong>
                <p>Email: {user.email}</p>
                <p>Gender: {user.gender}</p>
                <p>Role: {user.role}</p>
              </div>
            </div>
          ))
        ) : (
          <div>
            {/* <NotFound />  */}
          </div>
        )}
      </div>
    </div>
  );


}
export default Search;
