import React, { useState } from "react";
import './add-workers'
const AddWorkerForm = () => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [avatar, setAvatar] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [legalInfo, setLegalInfo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform form validation and submit data to backend
    // Example: You can make an API call to add the worker using fetch or axios
    const workerData = {
      name,
      position,
      salary,
      avatar,
      nationalId,
      legalInfo,
    };
console.log(workerData);

    // Reset form fields after submission
    setName("");
    setPosition("");
    setSalary("");
    setAvatar("");
    setNationalId("");
    setLegalInfo("");
  };

  return (
    <div id="add-workers">
      <h2>Add Worker</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="position">Position:</label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="salary">Salary:</label>
          <input
            type="text"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="avatar">Avatar:</label>
          <input
            type="text"
            id="avatar"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
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
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="legalInfo">Legal Information:</label>
          <textarea
            id="legalInfo"
            value={legalInfo}
            onChange={(e) => setLegalInfo(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="WRK-btn">Add Worker</button>
      </form>
    </div>
  );
};

export default AddWorkerForm;
