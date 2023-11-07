import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListItemButton } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MailIcon from "@mui/icons-material/Mail";
import BarChartIcon from '@mui/icons-material/BarChart';
import { useMediaQuery } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import checkUserRole from "../../Routes/checkUserRole";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {
  Typography,
  Box
} from '@mui/material'

function NavigationMenu({ open }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const userRole = checkUserRole(); // Get the user role using the imported function
  const location  = useLocation()
  const isMobile = !isDesktop;
  const isMenuOpen = useSelector((state) => state.header.isMenuOpen);
  const [hideNavigationMenu, setHideNavigationMenu ] = useState(true);
  

  useEffect(() => {
    setHideNavigationMenu(location.pathname.includes('admin'));
  }, [location.pathname]);

  if (hideNavigationMenu){
    return <Link to='/'>
    <HomeIcon color="primary"  />
    </Link> 
  }


const adminDesktop = [
  { text: "Home", icon: <HomeIcon />, route: "/" },
  { text: "Profile", icon: <AccountBoxIcon />, route: "/profile" },
  { text: "Account", icon: <ManageAccountsIcon />, route: "/settings" },
  { text: "Inbox", icon: <MailIcon />, route: "/inbox" },
  { text: "Dashb", icon: <DashboardIcon />, route: "/admin/showWorkers" },
  { text: "Charts", icon: <BarChartIcon />, route: "/admin/dashboard" },
];


const adminMobile = [
  { text: "Home", icon: <HomeIcon />, route: "/" },
  { text: "Profile", icon: <AccountBoxIcon />, route: "/profile" },
  { text: "Account", icon: <ManageAccountsIcon />, route: "/settings" },
  { text: "Inbox", icon: <MailIcon />, route: "/inbox" },
  { text: "Charts", icon: <BarChartIcon />, route: "/admin/dashboard" },
];


const getMenuItems = () => {
  switch (userRole) {
    case "admin":
      if (isDesktop) {
        return adminDesktop;
      } else {
        return adminMobile;
      }
    case "user":
      return [
        { text: "Profile", icon: <AccountBoxIcon />, route: "/profile" },
        { text: "Home", icon: <HomeIcon />, route: "/" },
        { text: "Inbox", icon: <MailIcon />, route: "/inbox" },
      ];
    default:
      // Handle other cases (unknown or any other role)
      return [];
  }
};


  const menuItems = getMenuItems();





  return (

    <div className="navigation-menu" style={{ zIndex: 9999, position: 'fixed',}}>
      <List>
        {menuItems.map((item, index) => (
          <Box>
            
          <ListItem key={item.text} disablePadding sx={{ display: "block", width: isMenuOpen ? 120 : 50 , boxShadow: '3px 0 10px rgba(0, 0, 0, 0.2)'}}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                width: isMenuOpen ? 140 : 50, 
                boxShadow: isMenuOpen ? '3px 0 10px rgba(0, 0, 0, 0.2)' : 'none',
                transition: '0.3s ease-in-out',
              }}
              component="a"
              href={item.route}
            >
               {isMenuOpen && (  
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: 1,   
                    marginLeft: 2,
                  }}
                /> 
              )}
              <ListItemIcon
                sx={{
                  minWidth: isMenuOpen ? 140 : 50, 
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          </Box>
        ))}
      </List>
    </div>
  );
  
}

export default NavigationMenu;


// CxaD4J2x8d75y.f

