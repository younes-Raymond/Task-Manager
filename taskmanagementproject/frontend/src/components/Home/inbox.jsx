import * as React from 'react';
import {
Avatar,Divider,ListItemText,ListItemAvatar,List,ListItem,Drawer,Typography,Box,Grid,Badge,Stack,styled,TextField,Paper,InputBase,IconButton
} from '@mui/material'
import { getAllUsers } from '../../actions/userAction';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions'
import Loading from '../Layouts/loading';
import SendIcon from '@mui/icons-material/Send';
import { useRef } from 'react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import EmojiPicker from 'emoji-picker-react'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));



const OnlineIndicator = ({user}) => (
  <StyledBadge
  overlap="circular"
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  variant="dot"
>
  <Avatar alt="Online" src={user.avatar.url} />
</StyledBadge>
);
  


const fakeCompaniesData = [
  { id: 1, name: 'Company A', avatar: 'companyA.jpg' },
  { id: 2, name: 'Company B', avatar: 'companyB.jpg' },
  { id: 2, name: 'Company B', avatar: 'companyB.jpg' },
  { id: 2, name: 'Company B', avatar: 'companyB.jpg' },
  { id: 2, name: 'Company B', avatar: 'companyB.jpg' },
];

// Sample data representing different types of messages
const messages = [
  { type: 'text', content: 'Hello, how are you?', sender: 'user' },
  { type: 'text', content: 'I am good, thank you!', sender: 'other' },
  { type: 'text', content: 'Hello, how are you?', sender: 'user' },
  { type: 'text', content: 'I am good, thank you!', sender: 'other' },
  { type: 'text', content: 'Hello, how are you?', sender: 'other' },
  { type: 'text', content: 'I am good, thank you!', sender: 'other' },
  { type: 'text', content: 'Hello, how are you?', sender: 'user' },
  { type: 'text', content: 'I am good, thank you!', sender: 'other' },
  { type: 'text', content: 'Hello, how are you?', sender: 'user' },
  { type: 'text', content: 'I am good, thank you!', sender: 'other' },
  { type: 'text', content: 'Hello, how are you?', sender: 'user' },
  { type: 'text', content: 'I am good, thank you! I am good, thank you! I am good, thank you! I am good, thank you! I am good, thank you!', sender: 'other' },
  { type: 'text', content: 'Hello, how are you?', sender: 'user' },
  { type: 'text', content: 'Hello, how are you?', sender: 'user' },
  { type: 'text', content: 'I am good, thank you!', sender: 'other' },
  { type: 'text', content: 'Hello, how are you?', sender: 'user' },
  { type: 'text', content: 'I am good, thank you!', sender: 'other' },
  { type: 'text', content: 'Hello, how are you?', sender: 'user' },
  { type: 'text', content: 'I am good, thank you!', sender: 'other' },
  { type: 'text', content: 'Hello, how are you?', sender: 'user' },
  { type: 'text', content: 'I am good, thank you!', sender: 'other' },
  { type: 'text', content: 'Hello, how are you?', sender: 'user' },
  { type: 'text', content: 'I am good, thank you!', sender: 'other' },
  { type: 'text', content: 'Hello, how are you?', sender: 'user' },
  { type: 'text', content: 'I am good, thank you! I am good, thank you! I am good, thank you! I am good, thank you! I am good, thank you!', sender: 'other' },
  { type: 'text', content: 'Hello, how are you?', sender: 'user' },

  // ... other message types
];



const TextMessage = ({ content, sender }) => (
  <Paper
    elevation={3}
    sx={{
      p: 1,
      mb: 1,
      maxWidth: '70%',
      wordWrap: 'break-word',
      borderRadius: '10px',
      background: sender === 'user' ? '#f3f3f8' : '#1976d2',
      color: sender === 'user' ?  'black' : '#f3f3f8',
      alignSelf: sender === 'user' ? 'flex-start' : 'flex-end',
      float: sender === 'user' ? 'left' : 'right', // Float left for user, right for other
      clear: 'both', // Clear the float to prevent layout issues
    }}
  >
    <Typography variant="body1" sx={{fontSize:'14px', fontWeight:'normal'}}>
      {content}
    </Typography>
  </Paper>
);




// Component for rendering image messages
const ImageMessage = ({ content }) => (
  <Paper elevation={3} sx={{ mb: 1 }}>
    <img src={content} alt="image" style={{ maxWidth: '100%', height: 'auto' }} />
  </Paper>
);

// Component for rendering file messages
const FileMessage = ({ content }) => (
  <Paper elevation={3} sx={{ p: 2, mb: 1 }}>
    <Typography variant="body1">File: {content}</Typography>
  </Paper>
);


const ChatLayout = () => {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading ] = React.useState(null);
    const [me, setMe ] = React.useState([]);
    const containerRef = useRef(null);
    const [isEmojiPickerVisible, setEmojiPickerVisible ] = React.useState(false);

const toggleEmojiPicker = () => {
  setEmojiPickerVisible((prev) => !prev);
};

React.useEffect(() => {
  containerRef.current.scrollTop = containerRef.current.scrollHeight;
}, [messages])


    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
              const res = await getAllUsers();
              const workers = res.users;
              const me = JSON.parse(localStorage.getItem('user'));
              // console.log(workers);
              console.log('me:', me)
              // Assuming `res` is an array of users, you can set it to the state
              setUsers(workers);
              setMe(me)
            } catch (error) {
              console.error('Error fetching users:', error);
            }
          };
          
          fetchUsers();
          
    }, []);
    
    return (
        <Grid container spacing={2}  >



          {/* Left Grid (Companies) */}
          <Grid item xs={6} md={3}  >
          <ListItem alignItems="flex-start">
  <ListItemAvatar>
    <Avatar alt={me.name} src={me.avatar?.url} />
  </ListItemAvatar>
  <ListItemText
    primary={me.name}
    secondary={
      <React.Fragment>
        <Typography
          sx={{ display: 'inline' }}
          component="span"
          variant="body2"
          color="text.primary"
        >
          {/* {me.name} */}
          {` — Full stack web developer…`}
        </Typography>
      </React.Fragment>
    }
  />
</ListItem>


              
              <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search in"
        inputProps={{ 'aria-label': 'search google maps' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>

    <Divider />

    <Typography variant='h6' color='primary'>CHANNELS</Typography>
    <Divider />

<List>
                  <ListItem>
                <div>

                  {fakeCompaniesData.map((company) => (
                    <div key={company.id}>
                      <ListItemAvatar>
                        <Avatar alt={company.name} src={company.avatar} />
                      </ListItemAvatar>
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {company.name}
                        </Typography>
                        {/* {" — I'll be in your neighborhood doing errands this…"} */}
                      </React.Fragment>
                    </div>
                  ))}
                </div>
              </ListItem>
              </List>


          </Grid>
    


          {/* Middle Grid (Conversation) */}
          <Grid item xs={12} md={6} sx={{
                  background: '',
                  position:'relative'
          }} >


            
          <Box
        ref={containerRef}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      height: '490px',
      overflowY: 'scroll',
      // background: '#f3f3f8',
      padding: '10px',
      borderRadius:'10px',
      scrollbarWidth: 'none', // Hide scrollbar for Firefox
      '&::-webkit-scrollbar': {
        width: '0 !important', // Hide scrollbar for Chrome, Safari, and Opera
      },
    }}
  >
   
   {messages.map((message, index) => (
        <React.Fragment key={index}>
          {index !== 0 && <Divider />}
          {message.type === 'text' && <TextMessage content={message.content} sender={message.sender} />}

        </React.Fragment>
      ))}

  </Box>
  
            <Paper
  component="form"
  sx={{
    m: '0 5%',
    p: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '40%',
    position: 'fixed',
    zIndex: '1002',
    borderRadius: '20px',

  }}
>
  <IconButton>
    <AttachFileIcon  />
  </IconButton>
  <IconButton>
  <PermMediaIcon color='primary' />
  </IconButton>
  <IconButton onClick={toggleEmojiPicker}>
    <InsertEmoticonIcon  color='primary'/>
  </IconButton>
  <Divider orientation='vertical' flexItem sx={{ margin: '1 10px', height: '80%' }}/>
  <InputBase
    sx={{ ml: 1, flex: 1 }}
    placeholder="Send a message"
    inputProps={{ 'aria-label': 'search google maps' }}
  />
  <IconButton>
    <SendIcon color='primary' />
  </IconButton>
 
</Paper>

{isEmojiPickerVisible && (
  <EmojiPicker
    onEmojiClick={(emojiData, event) => {
      // Handle the selected emoji
      console.log('Emoji clicked:', emojiData);
      // You can insert the selected emoji into the message input
    }}
    autoFocusSearch={true}
    theme="light"
    emojiStyle="apple"
    sx={{
      position: 'absolute',
      zIndex: '1001', 
      
    }}
    // ... other props
  />
)}


          
    </Grid>
    
   

          {/* Right Grid (Members) */}
          <Grid item xs={6} md={3} >
            <List>
              <ListItem>
                <div>
                  <Typography variant='h6'>Members</Typography>

                  <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Members"
        inputProps={{ 'aria-label': 'search google maps' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
</div>
</ListItem>
<Divider />
    

              {/* Right Grid Content (Members) */}
            
      {users.map((member) => (
        <ListItem key={member.id} alignItems="flex-start">
          <ListItemAvatar>
            <Stack direction="row" spacing={2}>
              <OnlineIndicator user={member} />
            </Stack>
          </ListItemAvatar>

          <ListItemText
            primary={member.name}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {member.position}
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
      ))}
  
  
            </List>
          </Grid>



        </Grid>
      );
};

export default ChatLayout;
