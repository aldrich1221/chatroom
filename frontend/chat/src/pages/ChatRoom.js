import React, { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import UserInfo from '../components/UserInfo';
import { auth, db } from "../Services/FireBase.js";
import Channel from "../components/channel/Channel.js";
// import FriendsList from "../components/friendsList/FriendsList.js";

import io from 'socket.io-client';

// Set the server URL where Socket.io is running
const socket = io('http://localhost:5000'); // Replace with your server URL

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentChannel, setCurrentChannel] = useState('111'); // Default channel or fetch from somewhere

  const navigate = useNavigate();

  // Grouped state for chat room data (name, userId)
  const [chatRoomData, setChatRoomData] = useState({
    userName: '',
    userId: '',
  });

  // Fetch messages and update the state when component mounts
  useEffect(() => {
    if (!auth.currentUser) return;

    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt"));

    // Set userId to current authenticated user
    setChatRoomData((prevData) => ({
      ...prevData,
      userId: auth.currentUser.uid,
    }));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map((doc) => doc.data());
      setMessages(messagesList);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [db]);


  useEffect(() => {
    // Establish the socket connection when the component is mounted
    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    // Cleanup: disconnect from the socket when the component unmounts
    return () => {
      // socket.disconnect();
    };
  }, []);

  // Example function to change the channel
  const changeChannel = (newChannel) => {
    setCurrentChannel(newChannel);
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return; // Prevent sending empty messages

    try {
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, {
        text: message,
        createdAt: new Date(),
        uid: auth.currentUser.uid,
      });
      setMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message: ", error);
    }
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
      {/* Display user info */}
      <UserInfo userName={chatRoomData.userName} userId={chatRoomData.userId} />
    {/* <FriendsList changeChannel={changeChannel} /> */}
      <Channel channel={currentChannel} socket={socket} /> 
      {/* Display chat messages */}
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg.text}</p>
        ))}
      </div>

      {/* Message input form */}
      {/* <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form> */}

      {/* Logout button */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ChatRoom;
