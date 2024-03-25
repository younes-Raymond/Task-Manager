import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import {
  Paper,
  Typography,
  Button,
  Icon, 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard'; 
import InventoryIcon from '@mui/icons-material/Inventory';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';


const StyledBox = styled(Paper)`
  padding: 20px;
  text-align: center;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 400px;
`;

const iconStyle = {
  fontSize: '5rem',
};

const Optionbox = () => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      <StyledBox elevation={3}>
        <DashboardIcon color="primary" style={iconStyle}/> {/* Dashboard Icon */}
        <Typography variant="h4">Dashboard</Typography>
        <Typography variant="body1">Click the button below to control By CRUDS System</Typography>
        <Button variant="contained" color="primary" component={Link} to="/admin/dashboard">
          CRUDS Data
        </Button>
      </StyledBox>
      
      <StyledBox elevation={3}>
        <InventoryIcon color="primary" style={iconStyle} /> 
        <Typography variant="h4">Add+ Materials</Typography>
        <Typography variant="body1">Click the button below to ADD+ or remove- materials:</Typography>
        <Button variant="contained" color="primary" component={Link} to="/admin/add-material">
          Add+..
        </Button>
      </StyledBox>

      <StyledBox elevation={3}>
        <WorkIcon color="primary" style={iconStyle}/> 
        <Typography variant="h4">Add+ Workers</Typography>
        <Typography variant="body1">Click the button below to Add+ or remove- Workers:</Typography>
        <Button variant="contained" color="primary" component={Link} to="/admin/add-worker">
          Add+..
        </Button>
      </StyledBox>

      <StyledBox elevation={3}>
        <GroupIcon color="primary" style={iconStyle}/> 
        <Typography variant="h4">Post Jobs</Typography>
        <Typography variant="body1">Click the button below to Add+ Jobs Available:</Typography>
        <Button variant="contained" color="primary" component={Link} to="/admin/add-jobs">
          Add+..
        </Button>
      </StyledBox>
    </div>
  );
};

export default Optionbox;
