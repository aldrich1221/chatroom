// import React, { useState, useEffect, useRef } from 'react';
// import './Channel.css';

// const fakeChannelData = {
//   AllUsersChannels: [
//     {
//       channelId: "111",
//       userIds: ["8v2jXLxrcMcR5lcB83etN3P6Rcf2", "ikrDLQmTrkSkkNHrMno0HKeAvOk1"],
//       messages: [
//         {
//           sender: "8v2jXLxrcMcR5lcB83etN3P6Rcf2",
//           time: "2024-09-13T08:00:00",
//           content: "Hey Long time no see. How are you?",
//           id: 1726185600000
//         },
//         {
//           sender: "ikrDLQmTrkSkkNHrMno0HKeAvOk1",
//           time: "2024-09-13T08:01:40",
//           content: "Fine",
//           id: 1726185700000
//         },
//         {
//           sender: "ikrDLQmTrkSkkNHrMno0HKeAvOk1",
//           time: "2024-09-13T08:03:20",
//           content: "Are you available now? Let's have lunch together.",
//           id: 1726185800000
//         },
//         {
//           sender: "8v2jXLxrcMcR5lcB83etN3P6Rcf2",
//           time: "2024-09-13T08:05:00",
//           content: "Sure. I'm glad to.",
//           id: 1726185900000
//         }
//       ]
//     }
//   ]
// };

// const Channel = ({ channel }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const messageEndRef = useRef(null);

//   // Initialize messages based on the selected channel
//   useEffect(() => {
//     const selectedChannel = fakeChannelData.AllUsersChannels.find(
//       (room) => room.channelId === channel
//     );
//     if (selectedChannel) {
//       setMessages(selectedChannel.messages);
//     }
//   }, [channel]);

//   // Scroll to the latest message whenever new messages are added

//   useEffect(() => {
//     if (messageEndRef.current) {
//       messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);


//   useEffect(() => {
//     if (channel) {
//       // Join the room
//       socket.emit('joinRoom', channel);

//       // Load message history from the server
//       fetch(`/messages/${channel}`)
//         .then((response) => response.json())
//         .then((data) => setMessages(data))
//         .catch((error) => console.error('Error fetching messages:', error));

//       // Handle incoming messages
//       socket.on('message', (message) => {
//         setMessages((prevMessages) => [...prevMessages, message]);
//       });

//       // Handle loading messages when connected
//       socket.on('loadMessages', (history) => {
//         setMessages(history);
//       });

//       return () => {
//         socket.off('message');
//         socket.off('loadMessages');
//       };
//     }
//   }, [channel]);


  
//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       const newMessageObject = {
//         id: Date.now(), // Unique ID for each message
//         sender: 'You', // Replace with the logged-in user's name
//         content: newMessage,
//       };
//       // setMessages((prevMessages) => [...prevMessages, newMessageObject]);
//       // setNewMessage('');
//       if (message.trim()) {
//         socket.emit('message', { channel, message });
//         setMessage('');
//       }
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="chat-room-container">
//       <div className="channel-name">Channel: {channel}</div>
//       <div className="message-list">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`message-item ${message.sender === 'You' ? 'my-message' : ''}`}
//           >
//             <strong>{message.sender}:</strong> {message.content}
//           </div>
//         ))}
//         <div ref={messageEndRef} />
//       </div>
//       <div className="input-container">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Type a message..."
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Channel;







import React, { useState, useEffect, useRef } from 'react';
import './Channel.css';

import io from 'socket.io-client';

// Set the server URL where Socket.io is running
const socket = io('http://localhost:5000'); // Replace with your server URL


const fakeChannelData = {
  AllUsersChannels: [
    {
      channelId: "111",
      userIds: ["8v2jXLxrcMcR5lcB83etN3P6Rcf2", "ikrDLQmTrkSkkNHrMno0HKeAvOk1"],
      messages: [
        {
          sender: "8v2jXLxrcMcR5lcB83etN3P6Rcf2",
          time: "2024-09-13T08:00:00",
          content: "Hey Long time no see. How are you?",
          id: 1726185600000
        },
        {
          sender: "ikrDLQmTrkSkkNHrMno0HKeAvOk1",
          time: "2024-09-13T08:01:40",
          content: "Fine",
          id: 1726185700000
        },
        {
          sender: "ikrDLQmTrkSkkNHrMno0HKeAvOk1",
          time: "2024-09-13T08:03:20",
          content: "Are you available now? Let's have lunch together.",
          id: 1726185800000
        },
        {
          sender: "8v2jXLxrcMcR5lcB83etN3P6Rcf2",
          time: "2024-09-13T08:05:00",
          content: "Sure. I'm glad to.",
          id: 1726185900000
        }
      ]
    }
  ]
};

const Channel = ({ channel, socket }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef(null);

  // Initialize messages based on the selected channel
  // useEffect(() => {
  //   const selectedChannel = fakeChannelData.AllUsersChannels.find(
  //     (room) => room.channelId === channel
  //   );
  //   if (selectedChannel) {
  //     setMessages(selectedChannel.messages);
  //   }
  // }, [channel]);

  // Scroll to the latest message whenever new messages are added
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // useEffect(() => {
  //   // Establish the socket connection when the component is mounted
  //   socket.on('connect', () => {
  //     console.log('Connected to the server');
  //   });

  //   // Cleanup: disconnect from the socket when the component unmounts
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // Handle socket connections for real-time messaging
  useEffect(() => {
    if (channel && socket) {
      // Join the room
      console.log("JoinRoom..",channel);
      socket.emit('joinRoom', channel);

      // Load message history from the server
      fetch(`/messages/${channel}`)
        .then((response) => response.json())
        .then((data) => setMessages(data))
        .catch((error) => console.error('Error fetching messages:', error));

      // Handle incoming messages
      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off('message');
      };
    }
  }, [channel, socket]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageObject = {
        id: Date.now(), // Unique ID for each message
        sender: 'You', // Replace with the logged-in user's name
        content: newMessage,
      };
      setMessages((prevMessages) => [...prevMessages, newMessageObject]);
      setNewMessage('');

      // Emit the message through the socket
      socket.emit('message', { channel, message: newMessage });
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
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-item ${message.sender === 'You' ? 'my-message' : ''}`}
          >
            <strong>{message.sender}:</strong> {message.content}
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
