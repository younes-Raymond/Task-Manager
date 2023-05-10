import React from 'react';
import { Link } from 'react-router-dom';
import './option.css';

const AddProductBox = () => {
  return (
    <div className='box'>
      <h2>Add Materials</h2>
      <p>Click the button below to add a new materials:</p>
      <Link to="/add-product">
        <button>+</button>
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

const Optionbox = () => {
  return (
    <div>
      <AddProductBox />
      <ShowProductsBox />
      <LearnMoreBox />
    </div>
  );
};

export default Optionbox;