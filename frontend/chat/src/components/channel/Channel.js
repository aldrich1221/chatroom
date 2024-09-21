import React, { useState, useEffect, useRef } from 'react';
import './Channel.css';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
const Channel = ({ channel, socket, chatRoomData ,currentChannelUsers}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (channel && socket) {
      // Join the room
      socket.emit('joinRoom', channel);

      // Handle incoming message history (loadMessages event)
      const loadMessagesListener = (historyMessages) => {
        console.log("loadMessagesListener...,",historyMessages)
        console.log("currentChannelUsers",currentChannelUsers)
        setMessages(historyMessages); // Set the message history from the server
      };

      // Handle incoming real-time messages (message event)
      const messageListener = (messageData) => {
        console.log("messageListener...,",messageData)
        setMessages((prevMessages) => [...prevMessages, messageData]);
      };

      socket.on('loadMessages', loadMessagesListener);
      socket.on('message', messageListener);

      return () => {
        // Cleanup listeners when channel changes
        socket.off('loadMessages', loadMessagesListener);
        socket.off('message', messageListener);
      };
    }
  }, [channel, socket]);

  const handleSendMessage = () => {
    console.log("handleSendMessage")
    if (newMessage.trim()) {
      // Emit message event to the server
      console.log("handleSendMessage...",chatRoomData.userId ,newMessage,channel)
      socket.emit('message', { roomId: channel, message: newMessage, senderId: chatRoomData.userId });

      setNewMessage(''); // Clear the input field
    }
  };

  const handleKeyPress = (e) => {
  
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-room-container">
      <div className="channel-name">Channel: {channel}</div>



<MainContainer>
  <ChatContainer>
    <MessageList>
      {messages.map((messageData, index) => (
        <div key={index}>
          {/* Add a fallback if currentChannelUsers or senderId is missing */}
          {currentChannelUsers && messageData.senderId && currentChannelUsers[messageData.senderId] ? (
            <strong>{currentChannelUsers[messageData.senderId]}</strong>
          ) : (
            <strong>Unknown User</strong>
          )}
          <Message
            model={{
              message: messageData.message,
              sentTime: messageData.sentTime,
              sender: messageData.senderId|| "Unknown",
              position: 3,
              direction: messageData.senderId === chatRoomData.userId ? 'outgoing' : 'incoming',
            }}
          />
        </div>
      ))}
    </MessageList>
    <MessageInput 
      value={newMessage}
      onChange={(val) => setNewMessage(val)}  // Use (val) => setNewMessage(val) for controlled input
      onSend={handleSendMessage}
      placeholder="Type message here" 
    />
  </ChatContainer>
</MainContainer>
    </div>
  );
};

export default Channel;
