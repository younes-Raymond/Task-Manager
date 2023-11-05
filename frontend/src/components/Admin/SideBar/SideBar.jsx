import { Link, useNavigate } from 'react-router-dom';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupIcon from '@mui/icons-material/Group';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkIcon from '@mui/icons-material/Work';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CloseIcon from '@mui/icons-material/Close';
import './SideBar.css';
import {
 Avatar,
 Button,
 Typography

} from '@mui/material'

const navMenu = [
    {
        icon: <EqualizerIcon />,
        label: "Dashboard",
        ref: "/admin/dashboard",
        key: "Dashboard"
    },
    {
        icon: <InventoryIcon />,
        label: "Materilas",
        ref: "/admin/showMaterial",
    },
    {
        icon: <AddBoxIcon />,
        label: "Add Material",
        ref: "/admin/add-material",
    },
    {
        icon: <GroupIcon />,
        label: "Workers",
        ref: "/admin/showWorkers",
    },
    {
        icon: <PersonAddAlt1Icon />,
        label: "Add Worker",
        ref: "/admin/add-worker",
    },
    {
      icon: <WorkIcon />,
      label: "Jobs",
      ref: "/admin/ShowJobs",
  },
  {
    icon: <WorkHistoryOutlinedIcon />,
    label: "Add+ Jobs",
    ref: "/admin/add-Jobs",
},
    {
        icon: <AccountBoxIcon />,
        label: "My Profile",
        ref: "/profile",
    },
    {
        icon: <LogoutIcon />,
        label: "Logout",
    },
];


const SideBar = ({ activeTab, setToggleSideBar }) => {
    const navigate = useNavigate();
    // const { enqueueSnackbar } = useSnackbar();
    const user  = JSON.parse(localStorage.getItem('user'));
    
  const handleLogout = () => {
      localStorage.clear()
        navigate("/login");
        window.location.reload()
    }
    
    
return (
          <aside className="aside sidebar-container">          
          <div className="Avatar">
            <Avatar alt="Avatar" src={user.avatar.url} />
            <div className="UserInfo">
            <Typography >{user.name}</Typography>
            </div>
            <Button onClick={() => setToggleSideBar(false)}  variant='contained' color='primary'> 
              <CloseIcon />
            </Button>
          </div>
            <Typography>{user.email}</Typography>
          
          <div className="NavMenu">
            {navMenu.map((item, index) => {
              const { icon, label, ref } = item;
              return (
                <>
                  {label === "Logout" ? (
                    <Button onClick={handleLogout} color='primary' variant='contained'>
                      <span>{icon}</span>
                      <span>{label}</span>
                    </Button>
                  ) : (
                    <Link to={ref} className={`${activeTab === index ? "ActiveLink" : "HoverLink"} FlexLink`}>
                      <span>{icon}</span>
                      <span>{label}</span>
                    </Link>
                  )}
                </>
              );
            })}
          </div>
          <Typography>Developed with ❤️ by:</Typography>
<Link href="https://www.linkedin.com/in/younes-raymond-188a40241/" target="_blank" rel="noreferrer">
  <Typography color='primary'>Younes Raymond</Typography>
</Link>
<Link href="raymondyounes2@gmail.com">
  <Typography sx={{fontSize:'12px'}}>raymondyounes2@gmail.com</Typography>
</Link>
        </aside>
);

};

export default SideBar;
