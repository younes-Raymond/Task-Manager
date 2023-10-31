import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getAllJobs } from '../../actions/userAction';
import SideBar from './SideBar/SideBar'
import Delete from '@mui/icons-material/Delete';
import axios from 'axios';
import Loading from '../Layouts/loading'
import { formatDate } from '../../utils/DateFormat';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
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
  ListItemText
  
 } from '@mui/material';
 // Import react-pdf components
import { Document, Page } from 'react-pdf';

const ShowMaterials = () => {
  const [Jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataGridRef = useRef();
  const [openPdfDialog, setOpenPdfDialog ] = useState(false);
  const [pdfUrl , setPdfUrl ] = useState('')

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAllJobs();
        console.log(res.data)
        const updatedJobs = res.data.map((job) => ({
          id: job._id,
          title: job.title,
          description: job.description,
          requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements,
          counter: job.counter,
          applicants: job.applicants || [],
          createdAt: formatDate(job.createdAt),
        }));
         
        console.log('updates jobs',updatedJobs)  
        setJobs(updatedJobs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchJobs();
  }, []);
  
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
      const response = await axios.post('/api/v1/editJobs', data);
      console.log('Data saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  
// 

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/job/${id}`);
      setJobs(Jobs.filter((material) => material._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenPdfDialog = (pdfUrl) => {
    setPdfUrl(pdfUrl); // Set the PDF URL
    setOpenPdfDialog(true); // Open the dialog
  };
  
  

  const handleClosePdfDialog = () => {
    setPdfUrl(''); // Clear the PDF URL
    setOpenPdfDialog(false);
  };
  


  const columns = [
  
    {
      field: 'title',
      headerName: 'Title',
      width: 300,
      editable: true
    },
   
  {
    field: 'description',
    headerName: 'Description',
    width: 300,
    editable: true,
    renderCell: (params) => (
      <div style={{ overflowWrap: 'break-word', width: '100%' }}>
        {params.value}
      </div>
    ),
  },


    {
      field: 'requirements',
      headerName: 'Requirements',
      editable: true,
      width: 300,
      renderCell: (params) => (
        <span>{Array.isArray(params.value) ? params.value.join(', ') : params.value}</span>
      ),
    },
    
    {
      field: 'counter',
      headerName: 'Applied',
      width: 80,
    },
    {
      field: 'applicants',
      headerName: 'Workers who Applicant',
      width: 250,
      renderCell: (params) => (
        <Box
        sx={{display:'flex', flexDirection:'column', }}
        >

        <List
        >
          {params.value && params.value.length > 0 ? (
            params.value.map((applicant, index) => (
              <ListItem key={index} sx={{m:'4'}}>
                {/* Use a button to open the PDF dialog */}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpenPdfDialog(applicant.file)}
                >
                  <PictureAsPdfIcon />
                  {applicant.name}
                </Button>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="N/A" />
            </ListItem>
          )}
        </List>
        </Box>

      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 150,
      renderCell: (params) => (
        <span>{params.value}</span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <Box>
          <IconButton>
          <Button  onClick={() => handleDelete(params.row._id)}>
            <Delete />
          </Button>
          </IconButton>
         
        </Box>
      ),
    },
  ];
  


  if (!Jobs.length) {
    return <SideBar />
 }

  return (
    <div className='wrapper'>
      <SideBar />

      <Box style={{ height: '800px', width: '100%', padding: '20px' }}>
        <DataGrid
          onCellEditCommit={handleRowEditCommit}
          rows={Jobs}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10]}
          ref={dataGridRef}
          checkboxSelection
          pagination
          rowHeight={80} // Adjust the row height as needed
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
      </Box>



<Dialog
  open={openPdfDialog}
  onClose={handleClosePdfDialog}
  maxWidth="lg" // Adjust the size as needed
  fullWidth
>
  <DialogTitle>PDF Viewer</DialogTitle>
  <DialogContent>

    <Document file={pdfUrl}>
      <Page pageNumber={1} width={400} /> 
    </Document>

    <object id="pdf" data={pdfUrl} type="application/pdf" width="100%" height="500">
      This browser does not support embedded PDFs. You can download the PDF <a href={pdfUrl}>here</a>.
    </object>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClosePdfDialog} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

 
 

    </div>
  );


};


export default ShowMaterials;
