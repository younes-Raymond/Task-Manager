import React from 'react';
import { Link } from 'react-router-dom';
import '../option.css';

const ABOUT_US = () => {
  return (
    <div className='box'>
      <h2>How To Use App</h2>
      <p>Click the button below To learn How To Use App</p>
      <Link to="/About-us">
        <button className='btn'>Using App</button>
      </Link>
    </div>
  );
};

const Marketing = () => {
  return (
    <div className='box' style={{ background: 'url(https://res.cloudinary.com/dktkavyr3/image/upload/v1691005956/omni-channel-technology-online-retail-business-approach-omni-channel-technology-online-retail-business-approach-multichannel-257954358_xnkkoa.webp)' }}>
      <h2 style={{color:'white'}}>Marketing plan</h2>
      <p style={{color:'white'}}>Click the button below to See your Marketing plan</p>
      <Link to='/Marketing-plan'>
        <button className='btn' >Become A Marketer</button>
      </Link>
    </div>
  );
};

const LearnBoxes = () => {
  return (
    <div className='boxes-container' >
      <ABOUT_US />
      <Marketing />
    </div>
  );
};

export default LearnBoxes;
