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
import Avatar from '@mui/material/Avatar';
// import { useSnackbar } from 'notistack';
import './SideBar.css';

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
    }
    
    
return (
          <aside className="aside sidebar-container">          
          <div className="Avatar">
            <Avatar alt="Avatar" src={user.avatar.url} />
            <div className="UserInfo">
            {/* <span className="UserName">{user.role}</span> */}
            <span className="UserName">{user.name}</span>
              <span className="UserEmail">{user.email}</span>
            </div>
            <button onClick={() => setToggleSideBar(false)} className="CloseButton">
              <CloseIcon />
            </button>
          </div>
          <div className="NavMenu">
            {navMenu.map((item, index) => {
              const { icon, label, ref } = item;
              return (
                <>
                  {label === "Logout" ? (
                    <button onClick={handleLogout} className="btn">
                      <span>{icon}</span>
                      <span>{label}</span>
                    </button>
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
          <div className="Footer">
            <h5>Developed with ❤️ by:</h5>
            <div className="ContactInfo">
              <a href="https://www.linkedin.com/in/younes-raymond-188a40241/" target="_blank" rel="noreferrer" className="DeveloperName">younes raymond</a>
              <a href="raymondyounes2@gmail.com" className="DeveloperEmail">{user.email}</a>
            </div>
          </div>
        </aside>
      );

};

export default SideBar;
