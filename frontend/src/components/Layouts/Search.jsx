import React, { useEffect, useState } from 'react';
import './Search.css'
const Search = () => {
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem('result');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFilteredMaterials(parsedData.materials || []);
      setFilteredUsers(parsedData.users || []);
    }
  }, [filteredUsers]);

  return (
    <div>
      <div className="materials-container">
        <h1>Material Results</h1>
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <div className="material-item" key={material._id}>
              <div className="image-container">
                <img src={material.images.url} alt="Material" />
              </div>
              <div className="material-details">
                <strong>{material.name}</strong>
                <p>{material.description}</p>
                <p>Category: {material.category}</p>
                <label htmlFor="stock">
                  Stock:
                  <span className={`counter ${material.stock > 0 ? 'green' : 'red'}`}>
                    {material.stock}
                  </span>
                </label>
              </div>
            </div>
          ))
        ) : (
          <p>No materials found.</p>
        )}
      </div>

      <div className="user-container">
        <h1>User Results</h1>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div className="user-item" key={user._id}>
              <div className="avatar-container">
                <img src={user.avatar.url} alt="User Avatar" />
              </div>
              <div className="user-details">
                <strong>{user.name}</strong>
                <p>Email: {user.email}</p>
                <p>Gender: {user.gender}</p>
                <p>Role: {user.role}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
