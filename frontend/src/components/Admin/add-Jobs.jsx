import React, { useState } from "react";
import axios from "axios";
import './add-jobs.css'

const AddJobForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

const handleSubmit = (e) => {
    e.preventDefault();
    // Create a job object with the form data
    const job = {
      title,
      description,
      requirements,
    };
    // Send a POST request to the backend server
    axios
      .post("https://your-api-endpoint.com/jobs", job)
      .then((response) => {
        console.log("Job data sent successfully:", response.data);
        // Reset form fields after successful submission
        setTitle("");
        setDescription("");
        setRequirements("");
      })
      .catch((error) => {
        console.error("Error sending job data:", error);
      });
  };
  return (
    <div className="Position-container">
      <h2>Add Job Position</h2>
      <form onSubmit={handleSubmit} >
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="requirements">Requirements:</label>
          <textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Add Job</button>
      </form>
    </div>
  );
};

export default AddJobForm;
