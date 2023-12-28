import * as React from 'react';
import {
Avatar,Divider,ListItemText,ListItemAvatar,List,ListItem,Drawer,Typography,Box,Grid,Badge,Stack,styled,TextField,Paper,InputBase,IconButton
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VideocamIcon from '@mui/icons-material/Videocam';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CallIcon from '@mui/icons-material/Call';
import { getAllUsers , sendMessages , getAllChats} from '../../actions/userAction';
import SearchIcon from '@mui/icons-material/Search';
import Loading from '../Layouts/loading';
import SendIcon from '@mui/icons-material/Send';
import { useRef } from 'react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import EmojiPicker from 'emoji-picker-react'
import { useSocket } from '../../actions/socketService'
import{ Howl } from 'howler';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import openSocket from 'socket.io-client';
const socket = openSocket('https://ajial.onrender.com');  // or 'wss://ajial.onrender.com' for secure WebSocket



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
  


const calculateBoxHeight = (itemCount) => {
  const maxHeight = 370; // Adjust the maximum height as needed
  const listItemHeight = 56; // Assuming the height of each list item is 56px, you can adjust this
  const calculatedHeight = listItemHeight * itemCount;
  return Math.min(calculatedHeight, maxHeight);
};



const fakeCompaniesData = [
  { id: 1, name: 'Company A', avatar: 'companyA.jpg' },
  { id: 2, name: 'Company B', avatar: 'companyB.jpg' },
  { id: 3, name: 'Company C', avatar: 'companyB.jpg' },
  { id: 4, name: 'Company D', avatar: 'companyB.jpg' },
  { id: 5, name: 'Company G', avatar: 'companyB.jpg' },
  { id: 6, name: 'Company J', avatar: 'companyB.jpg' },
  { id: 7, name: 'Company K', avatar: 'companyB.jpg' },
  { id: 8, name: 'Company L', avatar: 'companyB.jpg' },
  { id: 9, name: 'Company B', avatar: 'companyB.jpg' },
  { id: 10, name: 'Company I', avatar: 'companyB.jpg' },
  { id: 11, name: 'Company Y', avatar: 'companyB.jpg' },
  { id: 12, name: 'Company Z', avatar: 'companyB.jpg' },
];





const TextMessage = ({ src ,content, sender, iAm }) => {
  const isCurrentUser = sender === iAm?._id;
  const senderAvatarUrl = sender?.avatar?.url || 'https://res.cloudinary.com/dktkavyr3/image/upload/v1692559468/ntagij9ap6etxzphjkok.jpg';
  // console.log('content:' , content.avatar?.senderAvatar)
  // console.log('sender:' , src)
  // console.log('Sender Avatar URL:', senderAvatarUrl);

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          mb: 1,
          maxWidth: '70%',
          wordWrap: 'break-word',
          borderRadius: '10px',
          background: isCurrentUser ? '#1976d2' : '#f3f3f8',
          color: isCurrentUser ? '#f3f3f8' : 'black',
          alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
          marginLeft: isCurrentUser ? 'auto' : '0',
          marginRight: isCurrentUser ? '0' : 'auto',
          clear: 'both',
        }}
      >
        {!isCurrentUser && senderAvatarUrl && (
          <Avatar
            src={src.avatars.senderAvatar}
            style={{ width: '30px', height: '30px', marginRight: '8px' }}
          />
        )}
        <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: 'normal' }}>
          {content}
        </Typography>
      </Paper>
    </>
  );
};



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
    const [me, setMe ] = React.useState(null);
    const [receiver, setReceiver] =React.useState(null);
    const containerRef = useRef(null);
    const [isEmojiPickerVisible, setEmojiPickerVisible ] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const [iAm, setIAM ] = React.useState([]);
    const [selectedMemberBackgroundColor, setSelectedMemberBackgroundColor] = React.useState(null);
    const [chatMessages, setChatMessages ] = React.useState([]);
    const [response, setResponse ] = React.useState('')
    const isMounted = useRef(true);
    const [receivedMessages, setReceivedMessages] = React.useState([]);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));    
    const [senderAvatarUrl, setSenderAvatarUrl ] = React.useState('');
    const [senderName , setSenderName ] = React.useState('');

    const handleMemberSelect = async (member) => {
      try {
        // Reset background color for the previously selected member
        const previousSelected = document.querySelector(`[data-member-id="${receiver}"]`);
        if (previousSelected) {
          previousSelected.style.backgroundColor = 'inherit';
        }
    
        // Set the new receiver and update background color
        setReceiver(member._id);
        setSelectedMemberBackgroundColor('#f3f3f8');
    
        // Update the selected member in local storage
        localStorage.setItem('selectedMember', JSON.stringify(member._id));

        // Fetch chats for the selected member
        const res = await getAllChats(member._id, me._id);
        const allMessages = res.chats.flatMap((chat) => chat.messages);
        setChatMessages(allMessages);
        setSenderAvatarUrl(res.chats[1]?.messages[0]?.content?.avatars?.senderAvatar)
        // setSenderName(senderName)
        console.log('member2:', res.chats[0].messages[0].content.avatars.senderAvatar)
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    // 
    

    const handleHover = (event) => {
      event.currentTarget.style.backgroundColor = '#f0f0f0';
      event.currentTarget.style.cursor = 'pointer';
      event.currentTarget.style.borderRadius = '5px';
    };
    const handleHoverOut = (event, member) => {
      if (receiver !== member?._id) {
        event.currentTarget.style.backgroundColor = 'inherit';
      }
    };
    // Simplified getBackgroundColor
    const getBackgroundColor = (member) => (receiver === member?._id ? '#f3f3f8' : 'inherit');
    

      
    const sendMessage = async () => {
      try {
        if (!inputValue.trim() || !receiver || !me || receiver._id === me._id) {
          // Handle empty message case, or simply return without sending
          return;
        }
    
        // Make sure both me._id and receiver._id are valid
        if (!me._id || !receiver) {
          console.error('Invalid user IDs');
          return;
        }
    
        const data = {
          participants: [me._id, receiver],
          messages: [
            {
              sender: me._id,
              content: {
                type: 'text',
                data: inputValue,
              },
              timestamp: new Date(),
            },
          ],
        };
        socket.emit('message', { participants: data.participants, message: data.messages[0] });
    
        // Send message and get the updated chat
        const response = await sendMessages(data);
    
        if (response && response.chat && response.chat.messages && Array.isArray(response.chat.messages)) {
          // Update the state with the new messages
          setChatMessages((prevMessages) => {
            // Filter out messages that already exist in the state
            const newMessages = response.chat.messages.filter(
              (message) =>
                !prevMessages.some(
                  (prevMessage) =>
                    prevMessage.timestamp === message.timestamp && prevMessage.sender === message.sender
                )
            );
    
            // Concatenate previous messages with new messages
            const updatedMessages = [...prevMessages, ...newMessages];
    
            // Scroll to the bottom after updating messages
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
    
            return updatedMessages;
          });
    
          setInputValue('');
        } else {
          console.error('Invalid response structure:', response);
        }
      } catch (error) {
        // Handle any errors, if needed
        console.error('Error sending message:', error.message);
      }
    };
    
    

const handleBoxClick = () => {
  setEmojiPickerVisible(false);
};

const toggleEmojiPicker = () => {
  setEmojiPickerVisible((prev) => !prev);
};







React.useEffect(() => {
  // Create an abort controller
  const abortController = new AbortController();
  const signal = abortController.signal;

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers(signal); // Pass the signal to your async function
      const workers = res.users;
      const me = JSON.parse(localStorage.getItem('user'));
      setIAM(me);
      setUsers(workers);
      setMe(me);
    } catch (error) {
      // Check if the error is due to the component being unmounted
      if (error.name === 'AbortError') {
        console.log('Component unmounted, request aborted.');
      } else {
        console.error('Error fetching users:', error);
      }
    }
  };

  fetchUsers();

  // Cleanup function: abort the fetch if the component is unmounted
  return () => abortController.abort();
}, []);

React.useEffect(() => {
 
  // Check if there is a selected member in local storage
  const storedSelectedMember = localStorage.getItem('selectedMember');
  const selectedMember = storedSelectedMember ? JSON.parse(storedSelectedMember) : null;

  // Set the selected member to the state
  if (selectedMember) {
    setReceiver(selectedMember);

    // Check if 'me' is available and has '_id'
    if (me && me._id) {
      // Fetch chats for the selected member
      const fetchChats = async () => {
        try {
          const res = await getAllChats(selectedMember, me._id);
          const allMessages = res.chats.flatMap((chat) => chat.messages);
          setChatMessages(allMessages);
          setSelectedMemberBackgroundColor(selectedMember); // Assuming selectedMember is an ID
        } catch (error) {
          console.error('Error fetching chats:', error);
        }
      };
      

      // Call the fetchChats function
      fetchChats();
    }
  }
}, [me]);

const messageSound = new Howl({
  src: ['./sound/decidemp3-14575.mp3'],
  volume: 1,
  autoplay:true,
  html5:true,
  loop:true,
  onend : function() {
    console.log('finished');
  }
});
useSocket('message', (data) => {
  console.log('Received message data:', data.message.timestamp);
// Log the current state of the Howl instance
console.log('Howl instance:', messageSound);

// Try playing the sound
console.log('Playing message sound...');
messageSound.play();
  const content = data.message.content;
  const sender_id = data.message.sender;
  const timestamp = data.message.timestamp;

  // Use the updater function provided by setChatMessages
  setChatMessages((prevMessages) => {
    // Extract senderAvatar from the last message in prevMessages
    const lastMessage = prevMessages.length > 0 ? prevMessages[prevMessages.length - 1] : null;
    const senderAvatar = lastMessage ? lastMessage.content.avatars.senderAvatar : null;

    // Create a new message object with updated content and timestamp
    const newMessage = {
      content: {
        avatars: {
          senderAvatar: senderAvatar,
          otherAvatar: "https://res.cloudinary.com/dktkavyr3/image/upload/v1692559468/ntagij9ap6etxzphjkok.jpg",
        },
        data: content.data || "", // Use data.content.data or an empty string if it's undefined
        type: content.type || "text", // Use data.content.type or "text" if it's undefined
      },
      sender: sender_id,
      timestamp: timestamp, // Use the timestamp from the received message
      _id: Math.floor(Math.random() * 1000000).toString(),
    };

    // Log updated prevMessages
    console.log('Prev messages:', prevMessages);

    // Log newMessage
    console.log('New message:', newMessage);
    // Return the updated messages array (don't push to prevMessages directly)
    return [...prevMessages, newMessage];
  });
});








const sortedChatMessages = [...chatMessages].sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));


React.useEffect(() => {
  containerRef.current.scrollTop = containerRef.current.scrollHeight;
}, [sortedChatMessages]);


    return (
      <>

        <Grid container spacing={2}>


          {/* Left Grid (Companies) */}
          <Grid item xs={6} md={3}  >
          <ListItem alignItems="flex-start">
  <ListItemAvatar>
    <Avatar alt={iAm.name} src={iAm.avatar?.url} />
  </ListItemAvatar>
  <ListItemText
    primary={iAm.name}
    secondary={
      <React.Fragment>
        <Typography
          sx={{ display: 'inline' }}
          component="span"
          variant="body2"
          color="text.primary"
        >
          {/* {iAm.position} */}
          {` example— Full stack web developer…`}
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

    <Typography variant='h6' color='primary' sx={{m:'10px'}}>CHANNELS</Typography>
    <Divider />



    <List
  ref={containerRef}
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    overflowY: 'scroll',
    borderRadius: '10px',
    scrollbarWidth: 'none',
    height: calculateBoxHeight(50,  fakeCompaniesData.length),
    '&::-webkit-scrollbar': {
      width: '0 !important',
    },
  }}
>
  <ListItem sx={{ marginTop: 2 }}>
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        overflowY: 'scroll',
        padding: '10px',
        borderRadius: '10px',
        scrollbarWidth: 'none',
        height: calculateBoxHeight(fakeCompaniesData.length),
        '&::-webkit-scrollbar': {
          width: '0 !important',
        },
      }}
    >
     {fakeCompaniesData.map((company, index) => (
    <ListItem key={company.id} sx={{ marginTop: index === 0 ? '75vh' : '0' , cursor:'pointer'}} onMouseOver={handleHover} onMouseOut={handleHoverOut}>
    <ListItemAvatar>
      <Avatar alt={company.name} src={company.avatar} />
    </ListItemAvatar>
    <ListItemText
      primary={company.name}
      secondary={
        <React.Fragment>
          <Typography
            sx={{ display: 'inline' }}
            component="span"
            variant="body2"
            color="text.primary"
          >
            {company.name}
          </Typography>
        </React.Fragment>
      }
    />
  </ListItem>
))}

    </Box>
  </ListItem>
</List>



          </Grid>


          {/* Middle Grid (Conversation) */}
          <Grid item xs={12} md={6} sx={{
                  background: '',
                  position:'relative',
                  flexGrow:1
          }} 
          >
      <Paper
  sx={{
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: '1.3%',
    left: '52%', // Adjusted left position to center the component
    transform: 'translate(-50%, -50%)',
    zIndex: '1001',
    width: '96%',
  }}
>
  {/* Sender's information */}
  <IconButton>
    <ArrowBackIcon />
  </IconButton>
  <Avatar alt="Sender Avatar" src={senderAvatarUrl} />
  <Box sx={{ marginLeft: '10px', marginRight: 'auto' }}>
    <Typography variant='span'>Mehdi elatrassi</Typography>
  </Box>

  {/* Video, Call, and More icons */}
  <Divider orientation="vertical" flexItem sx={{ margin: '0 10px', height: '80%' }} />
  <IconButton>
    <VideocamIcon color='primary' />
  </IconButton>
  <IconButton>
    <CallIcon color='primary'/>
  </IconButton>
  <IconButton>
    <MoreVertIcon color='primary'/>
  </IconButton>
</Paper>


          <Box
        ref={containerRef}
        onClick={handleBoxClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      height: '490px',
      overflowY: 'scroll',
      padding: '10px',
      borderRadius:'10px',
      scrollbarWidth: 'none', // Hide scrollbar for Firefox
      '&::-webkit-scrollbar': {
        width: '0 !important', // Hide scrollbar for Chrome, Safari, and Opera
      },
    }}
  >
  
  {sortedChatMessages.map((message, index) => (
  <React.Fragment key={index}>
    {index !== 0 && <Divider />}
    
    {message.content.type === 'text' && (
      <React.Fragment>
        <TextMessage src={message.content} content={message.content.data} sender={message.sender} iAm={iAm}  />

      </React.Fragment>
    )}
    {/* Add similar conditions for other message types */}
    
    {/* Add margin to the bottom of the first item */}
    {index === 0 && (
      <Divider sx={{ marginBottom: '300px' }} />
    )}
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
    placeholder="Send a message..."
    inputProps={{ 'aria-label': 'Send Message..' }}
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
  />
    <IconButton onClick={sendMessage}>
    <SendIcon color='primary' />
  </IconButton>
  
 
</Paper>


<div style={{ position: 'absolute', zIndex: '1000', bottom:'60px'}}>
{isEmojiPickerVisible && (
  <EmojiPicker
    onEmojiClick={(emojiData, event) => {
      // Handle the selected emoji
      console.log('Emoji clicked:', emojiData);
      setInputValue((prevValue) => prevValue + emojiData.emoji)
      // You can insert the selected emoji into the message input
    }}
    autoFocusSearch={true}
    theme="light"
    emojiStyle="apple"
    sx={{
      position: 'absolute',
      bottom: '100%', // Adjust this value as needed
      zIndex: '1000',
    }}
    // ... other props
  />
)}
</div>
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
  <ListItem 
    key={member.id}
    data-member-id={member._id}
    alignItems="flex-start" 
    onMouseOver={handleHover} 
    onMouseOut={(event) => handleHoverOut(event, member)} 
    onClick={() => {
      setSelectedMemberBackgroundColor(null);
      handleMemberSelect(member);
    }}
    sx={{
      cursor: 'pointer',
      backgroundColor: getBackgroundColor(member), // Set the background color dynamically
    }}
  >
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



        </>
      );
};

export default ChatLayout;
