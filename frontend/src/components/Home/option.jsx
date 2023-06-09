import React from 'react';
import { Link } from 'react-router-dom';
import './option.css';



const AddProductBox = () => {
  return (
    <div className='box'>
      <h2>Dashboard</h2>
      <p>Click the button below to add a new materials:</p>
      <Link to="/add-material">
        <button>Dashboard</button>
      </Link>
    </div>
  );
};

const ShowProductsBox = () => {
  return (
    <div className='box'>
      <h2>Show Material</h2>
      <p>Click the button below to see all materials:</p>
      <Link to='/show-products'>
        <button>See Materials</button>
      </Link>
    </div>
  );
};

const LearnMoreBox = () => {
    return (
      <div className='box'>
        <h2>Who we Are</h2>
        <p>Click the button below to All Our Project</p>
        <Link to="/About-us">
          <button>Learn More</button>
        </Link>
      </div>
    );
  };

  const Jobs = () => {
    return (
      <div className='box'>
        <h2>Jobs</h2>
        <p>Click the button below to see All Jobs Available</p>
        <Link to="/Jobs">
          <button>Jobs Available</button>
        </Link>
      </div>
    );
  };
const Optionbox = () => {
  return (
    <div>
      <AddProductBox />
      <ShowProductsBox />
      <LearnMoreBox />
      <Jobs  />
    </div>
  );
};

export default Optionbox;



// import axios from 'axios';

// const postOfficeBranchName = 'New Delhi';
// axios.get(`https://api.postalpincode.in/postoffice/${postOfficeBranchName}`)
//   .then(response => {
//     const data = response.data[0];
//     console.log(data)
//     if (data.Status === "Success") {
//       const postOffices = data.PostOffice;
//       postOffices.forEach(postOffice => {
//         console.log(postOffice.Pincode);
//       });
//     } else {
//       console.log("No post office found for the given city name");
//     }
//   })
//   .catch(error => {
//     console.log(error);
//   });