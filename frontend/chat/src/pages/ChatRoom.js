import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import UserInfo from '../components/UserInfo';
import { auth } from "../Services/FireBase.js";
import { getUserById } from "../Services/UserService.js";
import Channel from "../components/channel/Channel.js";
import RoomList from "../components/roomManagement/RoomList.js";
import FriendManagement from "../components/friendManagement/FriendManagement.js";
import io from 'socket.io-client';
import axios from 'axios';
import { Grid, Box, Button, Typography, Container, Avatar } from '@mui/material'; 
import { Logout } from '@mui/icons-material'; 
import { MainContainer, ConversationHeader, VoiceCallButton, VideoCallButton, EllipsisButton } from "@chatscope/chat-ui-kit-react";

const socket = io(process.env.REACT_APP_BACKEND_URL);
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ChatRoom = () => {
  const [currentChannel, setCurrentChannel] = useState('');
  const [currentChannelUsers, setCurrentChannelUsers] = useState([]);
  const [currentChannelDisplayUsers, setCurrentChannelDisplayUsers] = useState([]);
  
  const [allChannelFriends, setAllChannelFriends] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [chatRoomData, setChatRoomData] = useState({ userName: '', userId: '' });
  const [refreshKey, setRefreshKey] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const response = await axios.get(`${backendUrl}/users/${auth.currentUser.uid}`);
          const userData = response.data;
          setChatRoomData({
            userName: userData.userName || 'Anonymous',
            userId: userData.uid,
            userEmail: userData.email,
            friends: userData.friends
          });
          console.log("chatRoomData",chatRoomData)
          console.log("friends",chatRoomData.friends)
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    socket.on('connect', () => console.log('Connected to the server'));
    return () => socket.off('connect');
  }, []);

  const changeChannel = (newChannel) => {
    setCurrentChannel(newChannel)
    console.log("changeChannel..newChannel",newChannel)

    const chooseRoom = rooms.find(x => x._id === newChannel); // Use `find` to get the correct room

    // if (chooseRoom) {
    //   const userNames = chooseRoom.users.map(user => user.userName); // Extract user names
    //   setCurrentChannelUsers(userNames); // Now it's an array of strings (user names)
    // } else {
    //   console.error(`Room with ID ${newChannel} not found.`);
    // }

    const userMapDict = new Map();

      
    if (chooseRoom.users) {
      chooseRoom.users.forEach((value) => {
        userMapDict.set(value.uid, value.userName);
      });
    }
     

    setCurrentChannelUsers(Object.fromEntries(userMapDict));
    console.log("changeChannel..rooms",rooms)
    console.log("changeChannel..allfriends",allChannelFriends)
    console.log("changeChannel..currentChanelfriends",currentChannelUsers)



  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
       
      <Grid container spacing={2} >
        {/* Sidebar */}
        <UserInfo userName={chatRoomData.userName} userEmail={chatRoomData.userEmail} />
       
        <Grid item xs={12} md={4} lg={3}>
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }} height={'100%'}>
          
            <FriendManagement
              userId={chatRoomData.userId}
              handleRefreshTrigger={() => setRefreshKey(prev => !prev)}
              friends={chatRoomData.friends}
            />
            <RoomList
              changeChannel={changeChannel}
              refreshKey={refreshKey}
              setAllChannelFriends={setAllChannelFriends}
              setRooms={setRooms}
              rooms={rooms}
            />
          </Box>
        </Grid>

        {/* Main Chat Area */}
        <Grid item xs={12} md={8} lg={9}>
  <MainContainer height={500}>
  <Box 
  width={'100%'} 
  height={'100%'}
  spacing={2}  
  style={{
    overflowY: 'auto', // Enables vertical scrolling
    overflowX: 'hidden', // Prevents horizontal scrolling
    border: '1px solid #ccc', // Optional: adds a border for better visibility
    padding: '10px', // Optional: adds padding for better layout
    spacing:2
  }}
>
      <ConversationHeader>
        <ConversationHeader.Back />
        <Avatar src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg" />
        <ConversationHeader.Content userName={currentChannelDisplayUsers} />
        <ConversationHeader.Actions>
          <VoiceCallButton />
          <VideoCallButton />
          <EllipsisButton orientation="vertical" />
        </ConversationHeader.Actions>
      </ConversationHeader>

      <Channel
        channel={currentChannel}
        socket={socket}
        chatRoomData={chatRoomData}
        currentChannelUsers={currentChannelUsers}
        height={'100%'}
      />
    </Box>
  </MainContainer>
</Grid>

      </Grid>

      {/* Logout Button */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Logout />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default ChatRoom;
