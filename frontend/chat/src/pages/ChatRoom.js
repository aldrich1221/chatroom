// src/components/ChatRoom.js
import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import UserInfo from '../components/UserInfo';
import { auth } from "../Services/FireBase.js";
import {getUserById} from "../Services/UserService.js"
import Channel from "../components/channel/Channel.js";
import RoomManagement from "../components/roomManagement/RoomManagement.js";
import FriendManagement from "../components/friendManagement/FriendManagement.js"
import io from 'socket.io-client';
import axios from 'axios'; // Import axios for making HTTP requests

// Set the server URL where Socket.io is running
const socket = io('http://localhost:5000'); // Replace with your server URL
const backendUrl = 'http://localhost:5000';
const ChatRoom = () => {
  const [currentChannel, setCurrentChannel] = useState(''); // Default channel
  const [chatRoomData, setChatRoomData] = useState({
    userName: '',
    userId: '',
  });
  const navigate = useNavigate();

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
  const changeChannel = (newChannel) => {
    setCurrentChannel(newChannel);
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
      <h2>Chat Room</h2>

      <UserInfo userName={chatRoomData.userName} userId={chatRoomData.userId} />
      <FriendManagement userId={chatRoomData.userId}></FriendManagement>
      <RoomManagement changeChannel={changeChannel}></RoomManagement>
      <Channel channel={currentChannel} socket={socket} chatRoomData={chatRoomData}/>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ChatRoom;
