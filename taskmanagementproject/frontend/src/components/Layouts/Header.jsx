import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { useDispatch , useSelector,  } from 'react-redux';
import logo from '../../assets/images/svgLogo.svg'
import {
   fetchRequests
} from '../../actions/userAction';
import { 
    IconButton,
    AppBar,
    Avatar,
    List,
    ListItem,
    Divider,
    ListItemText,
    ListItemAvatar,
    Typography,
    Box,
    Dialog,
    Button,
} from '@mui/material/'
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import NavigationMenu from './NavigationMenu';
import { useNavigate } from 'react-router-dom';
import { search } from '../../actions/userAction';
import { width } from '@mui/system';




const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));


const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));



export default function Header() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [keyword, setKeyword ] = React.useState('')
  const navigate = useNavigate();
  const [requestData, setRequestData]= React.useState([])
  const [AvatarUrl, setAvatarUrl ] = React.useState('')
  const  [pendingCount, setPendingCount ] = React.useState(0);
  const [approvedCount, setApprovedCount ] = React.useState('')
  const [rejectedCount, setRejectedCount ] = React.useState('')
  const [notificationDialogOpen, setNotificationDialogOpen ] = React.useState(false);
  const Ruser = useSelector(state => state.user);


 const fetchRequestsData = async () => {
  try {
    const res = await fetchRequests();
    // console.log('res:', res);
    if (res) {
      setRequestData(res.requestData);
      setPendingCount(res.requestData.pendingCount);
      setApprovedCount(res.requestData.approveCount);
      setRejectedCount(res.requestData.rejectedCount);
    }
  } catch (error) {
    console.error('Error fetching material requests:', error);
  }
};

React.useEffect(() => {
  // Check Redux store first
  if (Ruser && Ruser.avatar && Ruser.avatar.url) {
    console.log(Ruser.avatar.url);
    setAvatarUrl(Ruser.avatar.url);
  } else {
    // If not in Redux, check localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.avatar && user.avatar.url) {
      console.log(user.avatar.url);
      setAvatarUrl(user.avatar.url);
    }
  }
  
  // Fetch requests when the component mounts
  fetchRequestsData();
}, [Ruser]);

const handleLogOut = () => {
  localStorage.clear();
  navigate('/singin');
  window.location.reload();
};



const handleNotificationsOpen = () => {
  setNotificationDialogOpen(true);
}
const handleNotificationsClose = () => {
  setNotificationDialogOpen(false);
}

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    dispatch({ type: 'SET_MENU_CLOSE', payload: false }); 

  };

// three dots ... t/b
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };


  
  const toggleDrawer = () => {
    dispatch({ type: 'SET_MENU_OPEN', payload: !isMenuOpen }); // Toggle the value
    setOpen(!open);
  };
  
  
  
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      try {
        await search(keyword); 
        navigate(`/search/${keyword}`);
        navigate('/search');
      } catch (error) {
        console.error(error);
        navigate('/search');
      }
    } else {
      navigate('/search');
    }
  };
  

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
    <Link to= '/profile' style={{textDecoration:'none', color:'black'}} >  <MenuItem onClick={handleMenuClose}>Profile</MenuItem></Link>
    <Link to='/settings' style={{textDecoration:'none', color:'black'}}><MenuItem onClick={handleMenuClose}>My account</MenuItem></Link>
    <MenuItem onClick={handleLogOut}>
  <Button>Log Out</Button>
</MenuItem>

    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton 
        size="large" 
        aria-label="show 4 new mails" 
        color="inherit"
        onClick={handleNotificationsOpen} 
        >
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
          onClick={handleNotificationsOpen} 
        >
          <Badge badgeContent={pendingCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>

        <Link to="/profile" style={{textDecoration:'none', color:'black'}}>Profile</Link>
      </MenuItem>
    </Menu>
  );


  return (
    <div style={{ marginBottom: '3%', minHeight:'65px', }}>
     
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" open={open}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
            <Link to='/'>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                <Avatar src={logo} sx={{ color: 'white', background: 'transparent', width: '100px' }}>
                </Avatar>
              </Typography>
            </Link>
            <form action="" onSubmit={handleSubmit}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={(e) => setKeyword(e.target.value)}
                  value={keyword}
                />
              </Search>
            </form>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="error">
                <Link to="/inbox" style={{ textDecoration: 'none', color: 'inherit' }}>
  <MailIcon />
</Link>
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                onClick={handleNotificationsOpen} 
              >
                <Badge badgeContent={pendingCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of the current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar src={AvatarUrl}>
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <NavigationMenu />
        {renderMobileMenu}
        {renderMenu}
  
          <Dialog
          open={notificationDialogOpen}
          onClose={handleNotificationsClose}
          className="notifications-container"
          >


<List
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        zIndex: '10000',
        position: 'fixed',
        right: '5px',
        top: '65px',
      }}
    >
      {requestData?.pendingRequests?.map((request, index) => (
        <React.Fragment key={request?.requestId}>
          <ListItem
            alignItems="flex-start"
            sx={{
              '&:hover': {
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
              },
            }}
          >
            <ListItemAvatar>
              <Avatar alt={request?.requesterName} src={request?.requesterAvatar} />
            </ListItemAvatar>
            <ListItemText
              primary={request?.destination}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {request?.requesterName}
                  </Typography>
                  {` — ${requestData?.message}`}
                </React.Fragment>
              }
            />
          </ListItem>
          {index < (requestData?.pendingRequests?.length - 1) && (
            <Divider variant="inset" component="li" />
          )}
        </React.Fragment>
      ))}
    </List>



          </Dialog>
      
      </Box>
   
    </div>
  );
  


}
