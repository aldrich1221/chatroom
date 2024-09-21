// src/components/RoomManagement.js
import React, { useState, useEffect } from 'react';
import { createRoom, addUserToRoom, removeUserFromRoom, deleteRoom, getUserRooms } from '../../Services/RoomService';
import { auth } from '../../Services/FireBase';
import { ConversationList,Conversation } from "@chatscope/chat-ui-kit-react";
const RoomManagement = ({ changeChannel ,refreshKey ,setCurrentChannelUsers}) => {
  const [roomName, setRoomName] = useState('');
  const [userId, setUserId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [rooms, setRooms] = useState([]);
  const [userMapping,setUserMapping]=useState({})

  useEffect(() => {
    const fetchUserRooms = async () => {
      if (auth.currentUser) {
        try {
            // console.log("get user romms..",auth.currentUser.uid)
          const userRooms = await getUserRooms(auth.currentUser.uid);
          // console.log("Got room",userRooms)
          var userMapDict = new Map(); // Use Map instead of plain object

          userRooms.forEach(eachroom => {
            // Check if 'usersNames' exists before trying to loop through it
            if (eachroom.users) {
           
              eachroom.users.forEach((value, key) => {  // Iterate over the Map correctly
                userMapDict.set(value.uid, value.userName);  // Use set() for Map, and access the 'Name' field
                
              });
            }
          });
          console.log(userMapDict)
          setCurrentChannelUsers(Object.fromEntries(userMapDict)); 
          setRooms(userRooms);
        } catch (error) {
          console.error('Error fetching user rooms:', error);
        }
      }
    };

    fetchUserRooms();
  }, [refreshKey]);

  const handleCreateRoom = async () => {
    try {
      const newRoom = await createRoom(roomName, auth.currentUser.uid);
      setRooms([...rooms, newRoom]);
      setRoomName('');
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      await addUserToRoom(roomId, userId);
      // Optionally update the UI or fetch the updated room data
    } catch (error) {
      console.error('Error adding user to room:', error);
    }
  };

  const handleRemoveUser = async () => {
    try {
      await removeUserFromRoom(roomId, userId);
      // Optionally update the UI or fetch the updated room data
    } catch (error) {
      console.error('Error removing user from room:', error);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom(roomId);
      setRooms(rooms.filter(room => room._id !== roomId));
      setRoomId('');
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  return (
    <div>
      <h2>Room Management</h2>

      <div>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Room Name"
        />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>

      <div>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room ID"
        />
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
        />
        <button onClick={handleAddUser}>Add User</button>
        <button onClick={handleRemoveUser}>Remove User</button>
        <button onClick={handleDeleteRoom}>Delete Room</button>
      </div>

      {/* Display list of rooms */}
      <div>
       
        <ul>
          {/* {rooms.map(room => (
            <li key={room._id} onClick={() => changeChannel(room._id,room.usersName)}>{room._id} {room.name} </li>
          ))} */}


        </ul>
      </div>
    </div>
  );
};

export default RoomManagement;
