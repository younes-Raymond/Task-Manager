import React from "react";
import "./Jobs.css";



const Jobs = () => {
  return (
    <div className="jobs-container">
      <h2 className="company-name">Ajial-Amanagment</h2>
      <div className="job-listing">
        <h3 className="job-title">Plaster Art Maker</h3>
        <p className="job-description">
          We are seeking a talented Plaster Art Maker to join our team. The
          ideal candidate should have experience in creating stunning plaster
          art pieces using various techniques and materials.
        </p>
        <ul className="job-requirements">
          <li>Prior experience in plaster art making</li>
          <li>Proficiency in working with different plaster materials</li>
          <li>Strong attention to detail and creative mindset</li>
          <li>Ability to work independently and meet deadlines</li>
        </ul>
        <p className="job-application-details">
          Email: careers@ajial-amanagment.com
        </p>
        <p className="job-application-details">Phone: 123-456-7890</p>
      </div>

      <div className="job-listing">
        <h3 className="job-title">Interior Designer</h3>
        <p className="job-description">
          Ajial-Amanagment is looking for an experienced Interior Designer to
          join our team. The successful candidate will be responsible for
          designing and implementing creative interior spaces for our clients.
        </p>
        <ul className="job-requirements">
          <li>Bachelor's degree in Interior Design or related field</li>
          <li>Proven experience in residential and commercial interior design</li>
          <li>Proficiency in design software (e.g., AutoCAD, SketchUp)</li>
          <li>Excellent communication and presentation skills</li>
        </ul>
        <p className="job-application-details">
          Email: careers@ajial-amanagment.com
        </p>
        <p className="job-application-details">Phone: 123-456-7890</p>
      </div>
    </div>
  );
};

export default Jobs;
