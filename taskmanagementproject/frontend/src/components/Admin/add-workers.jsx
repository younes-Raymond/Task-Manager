import React, { useState } from "react";
import './add-workers.css';
import axios from 'axios';
import SideBar from "./SideBar/SideBar";
import {Snackbar, Alert , Dialog , DialogTitle, DialogContent, TextField, DialogActions, Button} from '@mui/material';
import CustomSnackbar from "../Layouts/Snackbar";
const AddWorkerForm = () => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [avatar, setAvatar] = useState([]);
  const [nationalId, setNationalId] = useState("");
  const [legalInfo, setLegalInfo] = useState("");
  const [phoneNumber , setPhoneNumber] = useState("");
  const defaultPassword = "example123"; // Default password for new workers
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create form data to send as multipart/form-data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("position", position);
    formData.append("salary", salary);
    formData.append("gender", gender);
    formData.append("avatar", avatar);
    formData.append("nationalId", nationalId);
    formData.append("phoneNumber", phoneNumber);
    formData.append("legalInfo", legalInfo);
    formData.append("password", defaultPassword); // Include default password
    avatar.forEach((image) => {
      formData.append('avatar', image);
      console.log(formData)
  
    });
    try {
      // Make the API call using Axios
      await axios.post("/api/v1/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleSnackbarOpen()
      setName("");
      setEmail("");
      setPosition("");
      setSalary("");
      setGender("");
      setAvatar("");
      setNationalId("");
      setPhoneNumber("");
      setLegalInfo("");
    } catch (error) {
      console.log(error);
      // Handle error if necessary
    }
  };

  const handleAvatarChange = (e) => {
    const files = e.target.files;
    const fileList = Array.from(files);
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setAvatar((prevAvatars) => [...prevAvatars, reader.result]);
      }
    })
  };

  return (
    <>
    <div className="wrapper">
      <SideBar /> 
    <div id="add-workers">
      <h2>Add Worker...</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter name"
          />
        </div>
        <div className="form-field">
          <label htmlFor="position">Position:</label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Enter position"
          />
        </div>
        <div className="form-field">
          <label htmlFor="salary">Salary:</label>
          <input
            type="number"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
            placeholder="Enter salary"
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter email"
          />
        </div>
        <div className="form-field">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="avatar">Avatar:</label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="nationalId">National ID Number:</label>
          <input
            type="text"
            id="nationalId"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            placeholder="Enter national ID number"
          />
        </div>
        <div className="form-field">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number +212"
          />
        </div>
        <div className="form-field">
          <label htmlFor="legalInfo">Legal Information:</label>
          <textarea
            id="legalInfo"
            value={legalInfo}
            onChange={(e) => setLegalInfo(e.target.value)}
            required
            placeholder="Enter legal information"
          ></textarea>
        </div>
        <button type="submit" className="btn">Add Worker</button>
      </form>
    </div>
    </div>
    {isSnackbarOpen && (
    <CustomSnackbar />
    )}
    </>
  );
};

export default AddWorkerForm;
