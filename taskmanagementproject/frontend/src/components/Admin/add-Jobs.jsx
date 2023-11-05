import React, { useState } from "react";
import axios from "axios";
import './add-jobs.css'
import Loading from "../Layouts/loading";
import SideBar from '../Admin/SideBar/SideBar';


const AddJobForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if email and phone are empty, and assign default values if they are
    const defaultEmail = email === '' ? 'company@example.com' : email;
    const defaultPhone = phone === '' ? '+1234567890' : phone;

    // Create a FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("requirements", requirements);
    formData.append("salary", salary);
    formData.append("email", defaultEmail);
    formData.append("phone", defaultPhone);

    // Send a POST request to the backend server
    axios
      .post("/api/v1/admin/addJobs", formData)
      .then((response) => {
        console.log("Job data sent successfully:", response.data);
        // Reset form fields after successful submission
        setTitle("");
        setDescription("");
        setRequirements("");
        setSalary("");
        setEmail("");
        setPhone("");
      })
      .catch((error) => {
        setLoading(true)
        console.error("Error sending job data:", error);
      });
  };
  if(loading){
    return <Loading />
  }

  return (
    <div className="wrapper">
      <SideBar /> 
    <div className="Position-container">
      <h2>Add Job Position</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter job title"
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter job description"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="requirements">Requirements:</label>
          <textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Enter job requirements"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="salary">Salary:</label>
          <input
            type="number"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="Enter job salary"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter company email"
            required
          />
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter company phone number"
            required
          />
        </div>
        <div>
          <button className="btn" type="submit">Add Job</button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddJobForm;
