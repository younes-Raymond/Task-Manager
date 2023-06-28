import React from 'react';
import { Link } from 'react-router-dom';
import './optionAdmin.css'

const Dashboard = () => {
  return (
    <div className='box'>
      <h2>Dashboard</h2>
      <p>Click the button below to controle By CRUDS System</p>
      <Link to="/Jobs">
      <button className='DS-btn'>CRUDS Data</button>
      </Link>
    </div>
  );
};


const AddWorkers = () => {
  return (
    <div className='box'>
      <h2>Add+ Workers </h2>
      <p>Click the button below to Add+ or remove- Workers:</p>
      <Link to="/add-worker">
      <button className='DS-btn'>Add+..</button>
      </Link>
    </div>
  );
};


const AddMaterials = () => {
  return (
    <div className='box'>
      <h2>Add+ Materials</h2>
      <p>Click the button below to ADD+ or remove- materials:</p>
      <Link to='/add-material'>
      <button className='DS-btn'>Add+..</button>
      </Link>
    </div>
  );
};


  const Jobs = () => {
    return (
      <div className='box'>
        <h2>Post Jobs</h2>
        <p>Click the button below to Add+ Jobs Available:</p>
        <Link to="/add-jobs">
          <button className='DS-btn'>Add+..</button>
        </Link>
      </div>
    );
};





const OptionboxWorkers = () => {
  return (
    <div className="DS-container">
    <div>
      <Dashboard  />
      <AddWorkers />
      <AddMaterials />
      <Jobs  />
    </div>
    </div>
  );
};

export default OptionboxWorkers;


