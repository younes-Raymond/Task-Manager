import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../actions/userAction';

import './registerPage.css';
function RegisterPage() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState([]);
  const [password, setPassword] = useState('');


  const handleProductImageChange = (e) => {
    const files = e.target.files[0];
    setFileToBase(files);
    console.log(files)
  }
 

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setAvatar(reader.result);
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.set('name', name);
    formData.set('destination', destination);
    formData.set('email', email);
    formData.set('gender', gender);
    formData.set('password', password);
    formData.append('avatar', avatar);
    console.log(formData.get('avatar')); // log the avatar file data

    dispatch(registerUser(formData));
  };

  return (
    <div className="register-page">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="destination">Destination:</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="avatar">Avatar:</label>
          <input
            type="file"
            id="avatar"
            onChange={handleProductImageChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;