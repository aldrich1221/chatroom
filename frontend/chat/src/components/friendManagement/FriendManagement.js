import React, { useState } from 'react';
import { searchUsers, addFriends } from '../../Services/UserService';
import { createRoom, addUserToRoom } from '../../Services/RoomService';
import { Grid, Button, TextField, Typography } from '@mui/material';

const FriendManagement = ({ userId, handleRefreshTrigger, friends }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendStatus, setFriendStatus] = useState({});

  const handleInputChange = (e) => setSearchQuery(e.target.value);

  const handleSearch = async () => {
    try {
      const response = await searchUsers(searchQuery);
      setSearchResults(response.length > 0 ? response : []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      await addFriends(userId, friendId);
      const newRoom = await createRoom("Friend Room", userId);
      await addUserToRoom(newRoom._id, friendId);

      setFriendStatus((prevStatus) => ({
        ...prevStatus,
        [friendId]: 'Friend added!',
      }));
      handleRefreshTrigger();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <TextField
          fullWidth
          label="Search by username or email"
          variant="outlined"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Grid>

      <Grid item>
        {searchResults.map((user) => (
          <Grid container direction="row" alignItems="center" justifyContent="space-between" key={user._id}>
            <Typography>{user.userName}</Typography>
           
            {friends.includes(user.uid) ? (
              <Button variant="contained" color="primary" disabled>
                Already Friends
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={() => handleAddFriend(user._id)}
                disabled={friends.includes(user._id)}
              >
                Add Friend
              </Button>
            )}
            {friendStatus[user._id] && <Typography>{friendStatus[user._id]}</Typography>}
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default FriendManagement;
