import React from 'react';
import { Link } from 'react-router-dom';



const AddProductBox = () => {
  return (
    <div className='box'>
      <h2>Add+ Workers </h2>
      <p>Click the button below to Add+ or remove- Workers:</p>
      <Link to="/add-worker">
        <button>Add+..</button>
      </Link>
    </div>
  );
};

const ShowProductsBox = () => {
  return (
    <div className='box'>
      <h2>Add+ Materials</h2>
      <p>Click the button below to ADD+ or remove- materials:</p>
      <Link to='/add-material'>
        <button>Add+..</button>
      </Link>
    </div>
  );
};


  const Jobs = () => {
    return (
      <div className='box'>
        <h2>Post Jobs</h2>
        <p>Click the button below to Add+ Jobs Available:</p>
        <Link to="/Jobs">
          <button>Add+..</button>
        </Link>
      </div>
    );
  };

  const Dashboard = () => {
    return (
      <div className='box'>
        <h2>Dashboard</h2>
        <p>Click the button below to controle By CRUDS System</p>
        <Link to="/Jobs">
          <button>Use CRUDS</button>
        </Link>
      </div>
    );
  };
const Optionbox = () => {
  return (
    <div>
      <AddProductBox />
      <ShowProductsBox />
      <Jobs  />
      <Dashboard  />
    </div>
  );
};

export default Optionbox;


