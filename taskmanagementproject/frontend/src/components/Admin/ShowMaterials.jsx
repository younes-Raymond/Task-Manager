import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getProducts } from '../../actions/productaction';
import SideBar  from './SideBar/SideBar'
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import axios from 'axios';
import Loading from '../Layouts/loading'
import { formatDate } from '../../utils/DateFormat'
import { DataGrid } from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import {   
  Dialog, 
  DialogTitle,
  DialogContent,
  DialogActions,
  Button, 
  IconButton,
  Box,
  ListItem,
  List,
  ListItemText,
  Typography,
  Avatar,
  Paper,
  
 } from '@mui/material';

const ShowMaterials = () => {
    const [material, setMaterial] = useState([]);
    const [loading, setLoading] = useState(true);
    const dataGridRef = useRef();

    useEffect(() => {
      const fetchMaterials = async () => {
        try {
          const data = await getProducts();
          console.log(data);
    
          // Modify the data before setting it in the state
          const updatedMaterials = data.products.map((material) => ({
            id: material._id,
            name: material.name,
            description: material.description,
            category: material.category,
            stock: material.stock,
            images: material.images,
            users: material.users || [],
            createdAt: formatDate(material.createdAt),
          }));
          console.log(updatedMaterials)
          setMaterial(updatedMaterials);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchMaterials();
    }, []);
    
   
    const handleDelete = async (id) => {
      try {
        await axios.delete(`/api/v1/material/${id}`);
        setMaterial(material.filter((material) => material._id !== id));
      } catch (error) {
        console.log(error);
      }
    };





    const handleRowEditCommit = React.useCallback(
      async (params) => {
        const id = params.id;
        const key = params.field;
        const value = params.value;
    
        // Create an object containing the edited data
        const editedData = {
          id: id,
          field: key,
          value: value,
        };
    
        // Deep copy the editedData to remove any circular references
        const copiedData = JSON.parse(JSON.stringify(editedData));
    
        handleSaveChanges(copiedData);
    
        // Return the edited data
        return editedData;
      },
      []
    );
  
  
    const handleSaveChanges = async (data) => { 
      try {
        const response = await axios.post('/api/v1/editMaterials', data);
        console.log('Data saved successfully:', response.data);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };



    // Define the columns separately
    const columns = [
      {
        field: 'images',
        headerName: 'Image',
        width: 80,
        editable:true,
        renderCell: (params) => (
          <Avatar src={params.value.url} />
        ),
      },
      { field: 'name', headerName: 'Name', width: 150 , editable:true},
      {
        field: 'description',
        headerName: 'Description',
        width: 300,
        editable:true,
        renderCell: (params) => (
          <div style={{ overflowWrap: 'break-word', width: '100%' }}>
            {params.value}
          </div>
        ),
      },
      { field: 'category', headerName: 'Category', width: 150 , editable:true},
      { field: 'stock', headerName: 'Stock', width: 100 , editable:true},
    
      {
        field: 'users',
        headerName: 'Users',
        width: 300,
        editable:true,
        renderCell: (params) => (
          <div>
            {params.value && params.value.length > 0 ? (
              <scrollbars>
                <Typography>Users:</Typography>
                {params.value.map((user, index) => (
                  <Paper elevation={3} key={index} className="user-box">
                    <Typography>Name: {user.name}</Typography>
                    <Typography>Email: {user.email}</Typography>
                  </Paper>
                ))}
              </scrollbars>

            ) : (
              <div>
                <Typography>Users:</Typography>
                <Typography>N/A</Typography>
              </div>
            )}
          </div>
        ),
      },
      
      {
        field: 'createdAt',
        headerName: 'Register At',
        width: 200,
        editable:true,
      },
      {
        field: 'actions',
        headerName: 'Modification',
        width: 150,
        editable:true,
        renderCell: (params) => (
          <div className='Edit-Delete-container'>
            <IconButton>
              <Button className='Delete' onClick={() => handleDelete(params.row._id)}>
                <Delete />
              </Button>
            </IconButton>
          </div>
        ),
      },
    ];
    

    if (!material.length) {
      return (
        <div>
       <SideBar />
       <Loading />;
        </div>
      )
    }
    return (
      <div className='wrapper'>
        <SideBar />
        {loading ? (
          <Loading />
        ) : (
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              onCellEditCommit={handleRowEditCommit}
              rows={material}
              columns={columns} // Assign the columns array here
              pageSize={5}
              loading={loading}
              pageSizeOptions={[5, 10]}
              ref={dataGridRef}
              checkboxSelection
              pagination
              rowHeight={80} 
    
            />
            <IconButton>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: '16px' }}
            onClick={handleSaveChanges}
          >
            <SaveIcon /> Save
          </Button>
        </IconButton>
          </div>
        )}
      </div>
    );
    
};
 
export default ShowMaterials;