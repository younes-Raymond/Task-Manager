import React from 'react';
import { Link } from 'react-router-dom';
import './optionAdmin.css';

const Dashboard = () => {
  return (
    <div className='box'>
      <Link to="/admin/dashboard">
        <h2>Dashboard</h2>
        <p>Click the button below to control By CRUDS System</p>
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
      <Link to="/admin/add-worker">
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
      <Link to='/admin/add-material'>
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
      <Link to="/admin/add-jobs">
        <button className='DS-btn'>Add+..</button>
      </Link>
    </div>
  );
};

const OptionboxWorkers = () => {
  // Check if the screen size is computer, laptop, or TV
  const isLargeScreen = window.innerWidth >= 1024;

  return (
    <div className="DS-container">
      <Dashboard />
      {isLargeScreen && (
        <>
          <AddWorkers />
          <AddMaterials />
          <Jobs />
        </>
      )}
    </div>
  );
};

export default OptionboxWorkers;
