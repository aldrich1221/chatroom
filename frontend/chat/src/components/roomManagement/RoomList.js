// src/components/RoomList.js
import React, { useState, useEffect } from 'react';
import { createRoom, addUserToRoom, removeUserFromRoom, deleteRoom, getUserRooms } from '../../Services/RoomService';
import { auth } from '../../Services/FireBase';
import { ConversationList,Conversation } from "@chatscope/chat-ui-kit-react";
const RoomList = ({ changeChannel ,refreshKey ,setCurrentChannelUsers}) => {
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

      {/* Display list of rooms */}
      <div>
        <h3>Rooms</h3>
        <ul>
          {/* {rooms.map(room => (
            <li key={room._id} onClick={() => changeChannel(room._id,room.usersName)}>{room._id} {room.name} </li>
          ))} */}
<ConversationList
  style={{
    height: '340px'
  }}
>
{rooms.map(room => {
  // Create an array of unique user names for each room
  const uniqueUserNames = Array.from(new Set(room.users.map(user => user.userName)));

  return (
    <Conversation
      key={room._id} // Ensure each Conversation has a unique key
      info={room._id}
      lastSenderName="Room Id" // You might want to dynamically set this based on your data
      name={uniqueUserNames.join(" ")} // Use the unique user names here
      onClick={() => changeChannel(room._id, room.usersName)} // Make sure `room.usersName` is defined
    />
  );
})}
</ConversationList>

        </ul>
      </div>
    </div>
  );
};

export default RoomList;
