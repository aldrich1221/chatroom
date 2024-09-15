import React, { useState, useEffect, useRef } from 'react';
import './Channel.css';

const Channel = ({ channel, socket, chatRoomData }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef(null);

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
        setMessages(historyMessages); // Set the message history from the server
      };

      // Handle incoming real-time messages (message event)
      const messageListener = (messageData) => {
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
    if (newMessage.trim()) {
      // Emit message event to the server
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
      <div className="message-list">
        {messages.map((messageData, index) => (
          <div
            key={index}
            className={`message-item ${messageData.senderId === chatRoomData.userId ? 'my-message' : ''}`}
          >
            <strong>{messageData.senderId === chatRoomData.userId ? 'Me' : messageData.senderId}:</strong> {messageData.message}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Channel;
