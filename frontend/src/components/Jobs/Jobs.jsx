import axios from 'axios'
import { useEffect, useState } from 'react'
import React from 'react'
import './Jobs.css'
import { format } from 'url'

const Jobs = () => {
  const [jobPosts, setJobPosts] = useState([])

  useEffect(() => {
    fetchJobPosts()
  }, [])

  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/api/v1/getAlljobs")
      setJobPosts(response.data.data)
    } catch (error) {
      console.error("Error fetching job posts:", error)
    }
  }

const LS = localStorage.getItem('')

  const handleApplyClick = (jobId) => {
    setJobPosts((prevJobPosts) =>
      prevJobPosts.map((jobPost) => {
        if (jobPost._id === jobId) {
          return {
            ...jobPost,
            showApplyForm: true
          }
        }
        return {
          ...jobPost,
          showApplyForm: false
        }
      })
    )
  }


  const handleSubmit = (e, jobId) => {
    e.preventDefault();
  
    const fileInput = e.target.elements.file;
    const file = fileInput.files[0];
  
    if (file && !isFileValid(file)) {
      alert('Only PDF or Word documents are allowed.');
      return;
    }
  
    // Create a FormData object
    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobId", jobId);
    format.append("jobID" )
    // Send a POST request to the backend server
    axios.post("/api/v1/applyJob", formData)
      .then(response => {
        console.log("Form submission successful:", response.data);
        // Reset form fields after successful submission
        e.target.reset();
        setJobPosts(prevJobPosts =>
          prevJobPosts.map(jobPost => {
            if (jobPost._id === jobId) {
              return {
                ...jobPost,
                showApplyForm: false
              };
            }
            return jobPost;
          })
        );
      })
      .catch(error => {
        console.error("Error submitting form:", error);
      });
  };
  

  const isFileValid = (file) => {
    const acceptedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    return acceptedFileTypes.includes(file.type)
  }

  return (
    <div className="jobs-container">
      <h2 className="company-name">AllMart-Company...</h2>
      {jobPosts.length > 0 ? (
        jobPosts.map((jobPost) => (
          <div className="job-listing" key={jobPost._id}>
            <h3 className="job-title">{jobPost.title}</h3>
            <p className="job-description">{jobPost.description}</p>
            <ul className="job-requirements">
              {jobPost.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
            <p className="job-application-details">
              Email: {jobPost.applicationDetails.email}
            </p>
            <p className="job-application-details">
              Phone: {jobPost.applicationDetails.phone}
            </p>
            {!jobPost.showApplyForm && (
              <button className="apply-button" onClick={() => handleApplyClick(jobPost._id)}>
                Apply For this Job
              </button>
            )}
            {jobPost.showApplyForm && (
              <div className="form-container">
                <hr />
                <form className="apply-form" onSubmit={(e) => handleSubmit(e, jobPost._id)}>
                  <input type="text" name="name" placeholder="Enter Your Name" required minLength={4} maxLength={50} />
                  <input type="email" name="email" placeholder="Enter Your Email" required />
                  <label htmlFor="file">
                    <input type="file" name="file" required accept=".pdf,.doc,.docx" />
                    Resume CV*:
                  </label>
                  <textarea type="message" placeholder="Your Message" required></textarea>
                  <button type="submit">Submit</button>
                </form>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No job posts found</p>
      )}
    </div>
  )
}

export default Jobs
