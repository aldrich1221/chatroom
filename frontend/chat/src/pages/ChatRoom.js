// src/components/ChatRoom.js
import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import UserInfo from '../components/UserInfo';
import { auth } from "../Services/FireBase.js";
import {getUserById} from "../Services/UserService.js"
import Channel from "../components/channel/Channel.js";
import RoomManagement from "../components/roomManagement/RoomManagement.js";
import RoomList from "../components/roomManagement/RoomList.js"
import FriendManagement from "../components/friendManagement/FriendManagement.js"
import io from 'socket.io-client';
import axios from 'axios'; // Import axios for making HTTP requests

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Sidebar,
  Search,
  ConversationList,
  Conversation,
  Avatar,
  ConversationHeader,
  VoiceCallButton,
  VideoCallButton,
  EllipsisButton,
  TypingIndicator,
  MessageSeparator
} from "@chatscope/chat-ui-kit-react";



// Set the server URL where Socket.io is running
const socket = io('http://localhost:5000'); // Replace with your server URL
const backendUrl = 'http://localhost:5000';
const ChatRoom = () => {
  const [currentChannel, setCurrentChannel] = useState(''); // Default channel
  const [currentChannelUsers,setCurrentChannelUsers]=useState([]);
  const [chatRoomData, setChatRoomData] = useState({
    userName: '',
    userId: '',
  });

  const [refreshKey, setRefreshKey] = useState(false);
  const handleRefreshTrigger = () => {
    setRefreshKey(prev => !prev); // Toggle the trigger state
  };

  const navigate = useNavigate();
  const tabs = [
    {
      label: 'Tab 1',
      content: <div>Content for Tab 1</div>,
    },
    {
      label: 'Tab 2',
      content: <div>Content for Tab 2</div>,
    },
    {
      label: 'Tab 3',
      content: <div>Content for Tab 3</div>,
    },
  ];

  useEffect(() => {
    
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          // Fetch user data from the backend
          console.log("get user data")
          const response = await axios.get(`${backendUrl}/users/${auth.currentUser.uid}`);

        
          const userData=response.data
          console.log(userData)
          // Set user data in state
          setChatRoomData({
            userName: userData.userName || 'Anonymous',
            userId: userData.uid,
            userEmail:userData.email,
            friends:userData.friends
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  // Establish the socket connection when the component is mounted
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    return () => {
      // Cleanup: disconnect from the socket when the component unmounts
      socket.off('connect');
      socket.off('message');
    };
  }, []);

  // Example function to change the channel
  const changeChannel = (newChannel,users) => {
    setCurrentChannel(newChannel);
    // setCurrentChannelUsers(users);
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div>
      {/* <h2>Chat Room</h2> */}

      <UserInfo userName={chatRoomData.userName} userEmail={chatRoomData.userEmail} />
      
      {/* <FriendManagement userId={chatRoomData.userId} handleRefreshTrigger={handleRefreshTrigger} friends={chatRoomData.friends}></FriendManagement> */}
      {/* <RoomManagement changeChannel={changeChannel} refreshKey={refreshKey} setCurrentChannelUsers={setCurrentChannelUsers} ></RoomManagement> */}
      {/* <RoomList changeChannel={changeChannel} refreshKey={refreshKey} setCurrentChannelUsers={setCurrentChannelUsers} ></RoomList> */}
      {/* <Channel channel={currentChannel} socket={socket} chatRoomData={chatRoomData} currentChannelUsers={currentChannelUsers}/> */}

      <MainContainer
  responsive
  className="container mt-4"
  style={{
    height: '600px',
    width: '90%',
    margin: '0 auto', // centers the container horizontally
    display: 'flex', // use flexbox if you want to align child elements
    alignItems: 'center', // vertically centers the content if display is flex
    justifyContent: 'center', // horizontally centers the content if display is flex
}}
>
  <Sidebar
    position="left"
  >
    {/* <Search placeholder="Search..." /> */}
    <FriendManagement userId={chatRoomData.userId} handleRefreshTrigger={handleRefreshTrigger} friends={chatRoomData.friends}></FriendManagement>
    {/* <ConversationList>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Lilly"
        name="Lilly"
      >
        <Avatar
          name="Lilly"
          src="https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"
          status="available"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Joe"
        name="Joe"
      >
        <Avatar
          name="Joe"
          src="https://chatscope.io/storybook/react/assets/joe-v8Vy3KOS.svg"
          status="dnd"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Emily"
        name="Emily"
        unreadCnt={3}
      >
        <Avatar
          name="Emily"
          src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
          status="available"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Kai"
        name="Kai"
        unreadDot
      >
        <Avatar
          name="Kai"
          src="https://chatscope.io/storybook/react/assets/kai-5wHRJGb2.svg"
          status="unavailable"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Akane"
        name="Akane"
      >
        <Avatar
          name="Akane"
          src="https://chatscope.io/storybook/react/assets/akane-MXhWvx63.svg"
          status="eager"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Eliot"
        name="Eliot"
      >
        <Avatar
          name="Eliot"
          src="https://chatscope.io/storybook/react/assets/eliot-JNkqSAth.svg"
          status="away"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Zoe"
        name="Zoe"
      >
        <Avatar
          name="Zoe"
          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
          status="dnd"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Patrik"
        name="Patrik"
      >
        <Avatar
          name="Patrik"
          src="https://chatscope.io/storybook/react/assets/patrik-yC7svbAR.svg"
          status="invisible"
        />
      </Conversation>
    </ConversationList> */}
      <RoomList changeChannel={changeChannel} refreshKey={refreshKey} setCurrentChannelUsers={setCurrentChannelUsers} ></RoomList>
  </Sidebar>
  {/* <ChatContainer position="right"> */}
    <div  style={{
    height: '600px',
    width:'100%'
  }}>
          <ConversationHeader>
      <ConversationHeader.Back />
      <Avatar
        name="Zoe"
        src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
      />
      <ConversationHeader.Content
        info="Active 10 mins ago"
        userName="Zoe"
      />
      <ConversationHeader.Actions>
        <VoiceCallButton />
        <VideoCallButton />
        <EllipsisButton orientation="vertical" />
      </ConversationHeader.Actions>
    </ConversationHeader>
    {/* <MessageList typingIndicator={<TypingIndicator content="Zoe is typing" />}>
      <MessageSeparator content="Saturday, 30 November 2019" />
      <Message
        model={{
          direction: 'incoming',
          message: 'Hello my friend',
          position: 'single',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      >
        <Avatar
          name="Zoe"
          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        />
      </Message>
      <Message
        avatarSpacer
        model={{
          direction: 'outgoing',
          message: 'Hello my friend',
          position: 'single',
          sender: 'Patrik',
          sentTime: '15 mins ago'
        }}
      />
      <Message
        avatarSpacer
        model={{
          direction: 'incoming',
          message: 'Hello my friend',
          position: 'first',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      />
      <Message
        avatarSpacer
        model={{
          direction: 'incoming',
          message: 'Hello my friend',
          position: 'normal',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      />
      <Message
        avatarSpacer
        model={{
          direction: 'incoming',
          message: 'Hello my friend',
          position: 'normal',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      />
      <Message
        model={{
          direction: 'incoming',
          message: 'Hello my friend',
          position: 'last',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      >
        <Avatar
          name="Zoe"
          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        />
      </Message>
      <Message
        model={{
          direction: 'outgoing',
          message: 'Hello my friend',
          position: 'first',
          sender: 'Patrik',
          sentTime: '15 mins ago'
        }}
       />
      <Message
        model={{
          direction: 'outgoing',
          message: 'Hello my friend',
          position: 'normal',
          sender: 'Patrik',
          sentTime: '15 mins ago'
        }}
       />
      <Message
        model={{
          direction: 'outgoing',
          message: 'Hello my friend',
          position: 'normal',
          sender: 'Patrik',
          sentTime: '15 mins ago'
        }}
       />
      <Message
        model={{
          direction: 'outgoing',
          message: 'Hello my friend',
          position: 'last',
          sender: 'Patrik',
          sentTime: '15 mins ago'
        }}
       />
      <Message
        avatarSpacer
        model={{
          direction: 'incoming',
          message: 'Hello my friend',
          position: 'first',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      />
      <Message
        model={{
          direction: 'incoming',
          message: 'Hello my friend',
          position: 'last',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      >
        <Avatar
          name="Zoe"
          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        />
      </Message>
    </MessageList> */}

    <Channel channel={currentChannel} socket={socket} chatRoomData={chatRoomData} currentChannelUsers={currentChannelUsers}/>

    {/* <MessageInput placeholder="Type message here" /> */}
    </div>

  {/* </ChatContainer> */}
</MainContainer>
      <button onClick={handleLogout}>Logout</button>

      
    </div>
  );
};

export default ChatRoom;
