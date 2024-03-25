import {
Paper , Avatar, Typography
} from '@mui/material'

export const TextMessage = ({ src ,content, sender, iAm }) => {
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