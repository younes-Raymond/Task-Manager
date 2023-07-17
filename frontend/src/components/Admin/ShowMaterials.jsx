import React, { useEffect, useState } from 'react';
import { getProducts } from '../../actions/productaction';
import './Show-workers.css'
import SideBar  from './SideBar/SideBar'
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import axios from 'axios';
import Loading from '../Layouts/loading'
import { formatDate } from '../../utils/DateFormat'

const ShowMaterials = () => {
    const [material, setMaterial] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchMaterials = async () => {
        const data = await getProducts();
        setMaterial(data.products);
        setLoading(false);
      };
      fetchMaterials();
    }, []);
    if (!material.length) {
      return (
        <div>
       <SideBar />
       <Loading />;
        </div>
      )
    }
    const handleDelete = async (id) => {
      try {
        await axios.delete(`/api/v1/material/${id}`);
        setMaterial(material.filter((material) => material._id !== id));
      } catch (error) {
        console.log(error);
      }
    };
    return (
        <div className='wrapper'>
          <SideBar />
          {loading? (
            <Loading />
          ) : (
            <table className="table-container">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>descriptionl</th>
                  <th>Category</th>
                  <th>stock</th>
                  <th>Image</th>
                  <th>Users</th>
                  <th>Register At</th>
                  <th>Modification</th>
                </tr>
              </thead>
              <tbody>
                {material.map((Material) => (
                  <tr key={Material._id}>
                    <td>{Material.name}</td>
                    <td>{Material.description}</td>
                    <td>{Material.category}</td>
                    <td>{Material.stock}</td>
                    <td> 
                        <img src={Material.images.url} alt="" className='image' />
                    </td>
                    <td className='Users-list'>
  {Material.users && Material.users.length > 0 ? (
    <div>
      <label className="users-label">Users:</label>
      <ul className="users-list">
        {Material.users.map((user, index) => (
          <li key={index}>
            <div className="user-info">
              <label className="name-label">Name:</label>
              <span className="Name">{user.name}</span>
              <br />
              <label className="email-label">Email:</label>
              <span className="email">{user.email}</span>
            </div>
            {index !== Material.users.length - 1 && <hr className="user-separator" />}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div>
      <label className="users-label">Users:</label>
      <p className="users-none">N/A</p>
    </div>
  )}
</td>
                    <td>{formatDate(Material.createdAt)}</td>
                    <td className='Edit-Delete-container'>
                      <button className='Edit'>
                        Edit:
                        <Edit /> 
                      </button>
                      <button className='Delete' onClick={() => handleDelete(Material._id)}>
                        Delete:
                        <Delete />
                      </button>   
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
};
 
export default ShowMaterials;