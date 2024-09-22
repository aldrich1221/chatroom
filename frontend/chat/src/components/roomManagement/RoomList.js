import React, { useState, useEffect } from 'react';
import { createRoom, addUserToRoom, removeUserFromRoom, deleteRoom, getUserRooms } from '../../Services/RoomService';
import { auth } from '../../Services/FireBase';
import { ConversationList, Conversation } from "@chatscope/chat-ui-kit-react";
import { Box, Button, TextField, Typography, Grid } from '@mui/material';

const RoomList = ({ changeChannel, refreshKey, setAllChannelFriends ,setRooms,rooms}) => {
  const [roomName, setRoomName] = useState('');
  const [userId, setUserId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [userMapping, setUserMapping] = useState({});

  useEffect(() => {
    const fetchUserRooms = async () => {
      if (auth.currentUser) {
        try {
          const userRooms = await getUserRooms(auth.currentUser.uid);
          const userMapDict = new Map();

          userRooms.forEach((eachroom) => {
            if (eachroom.users) {
              eachroom.users.forEach((value) => {
                userMapDict.set(value.uid, value.userName);
              });
            }
          });

          setAllChannelFriends(Object.fromEntries(userMapDict));
      
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
    } catch (error) {
      console.error('Error adding user to room:', error);
    }
  };

  const handleRemoveUser = async () => {
    try {
      await removeUserFromRoom(roomId, userId);
    } catch (error) {
      console.error('Error removing user from room:', error);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom(roomId);
      setRooms(rooms.filter((room) => room._id !== roomId));
      setRoomId('');
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Rooms
      </Typography>
      <ConversationList
        style={{
          height: '340px',
          overflowY: 'auto',
        }}
      >
        {rooms.map((room) => {
          const uniqueUserNames = Array.from(new Set(room.users.map((user) => user.userName)));

          return (
            <Conversation
              key={room._id}
              info={room._id}
              lastSenderName="Room ID"
              name={uniqueUserNames.join(' ')}
              onClick={() => changeChannel(room._id, room.usersName)}
            />
          );
        })}
      </ConversationList>

      {/* <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth onClick={handleCreateRoom}>
            Create Room
          </Button>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="secondary" fullWidth onClick={handleAddUser}>
            Add User to Room
          </Button>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={6}>
          <Button variant="outlined" color="error" fullWidth onClick={handleRemoveUser}>
            Remove User
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button variant="contained" color="error" fullWidth onClick={handleDeleteRoom}>
            Delete Room
          </Button>
        </Grid>
      </Grid> */}
    </Box>
  );
};

export default RoomList;
