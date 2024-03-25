import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListItemButton } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MailIcon from "@mui/icons-material/Mail";
import BarChartIcon from '@mui/icons-material/BarChart';
import { useMediaQuery } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  Typography,
  Box
} from '@mui/material'

function NavigationMenu({ open }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const location = useLocation();
  const isMenuOpen = useSelector((state) => state.header.isMenuOpen);
  const user = JSON.parse(localStorage.getItem('user'));




  console.log(isMenuOpen)
 

  const getMenuItems = () => {
    switch (user?.role) {
      case "admin":
        if (isDesktop) {
          return [
            { text: "Home", icon: <HomeIcon />, route: "/" },
            { text: "Profile", icon: <AccountBoxIcon />, route: "/profile" },
            { text: "Account", icon: <AccountBoxIcon />, route: "/settings" },
            { text: "Inbox", icon: <MailIcon />, route: "/inbox" },
            { text: "Dashb", icon: <DashboardIcon />, route: "/admin/showWorkers" },
            { text: "Charts", icon: <BarChartIcon />, route: "/admin/dashboard" },
          ];
        } else {
          return [
            { text: "Home", icon: <HomeIcon />, route: "/" },
            { text: "Profile", icon: <AccountBoxIcon />, route: "/profile" },
            { text: "Account", icon: <AccountBoxIcon />, route: "/settings" },
            { text: "Inbox", icon: <MailIcon />, route: "/inbox" },
            { text: "Charts", icon: <BarChartIcon />, route: "/admin/dashboard" },
          ];
        }
      case "user":
        return [
          { text: "Profile", icon: <AccountBoxIcon />, route: "/profile" },
          { text: "Home", icon: <HomeIcon />, route: "/" },
          { text: "Inbox", icon: <MailIcon />, route: "/inbox" },
          { text: "Account", icon: <AccountBoxIcon />, route: "/settings" },

        ];
      default:
        // Handle other cases (unknown or any other role)
        return [
          { text: "Home", icon: <HomeIcon />, route: "/" },
          { text: "Profile", icon: <AccountBoxIcon />, route: "/profile" },
          { text: "Inbox", icon: <MailIcon />, route: "/inbox" },
          { text: "Account", icon: <AccountBoxIcon />, route: "/settings" },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div
      className="navigation-menu"
      style={{
        zIndex: 9999,
        position: 'fixed',
        background:'#f3f3f8',
        transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.5s ease-in-out',
      }}
    >
      {isMenuOpen && (
        <List>
          {menuItems.map((item, index) => (
            <Box key={item.text}>
              <ListItem disablePadding sx={{ display: "block", width: 140, boxShadow: '3px 0 10px rgba(0, 0, 0, 0.2)' }}>
                <Link to={item.route} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      width: 140,
                      boxShadow: '3px 0 10px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <ListItemText
                      primary={item.text}
                      sx={{
                        opacity: 1,
                        marginLeft: 2,
                      }}
                    />
                    <ListItemIcon
                      sx={{
                        minWidth: 140,
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </ListItemButton>
                </Link>
              </ListItem>
            </Box>
          ))}
        </List>
      )}
    </div>
  );


}

export default NavigationMenu;
