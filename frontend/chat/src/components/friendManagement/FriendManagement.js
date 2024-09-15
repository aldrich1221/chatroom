import React, { useState } from 'react';
import axios from 'axios';
import { searchUsers,addFriends} from '../../Services/UserService';
import { createRoom,addUserToRoom} from '../../Services/RoomService';
const FriendManagement = ({ userId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendStatus, setFriendStatus] = useState({});

  // Handle search input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Search users by username or email
  const handleSearch = async () => {
    try {
      const response =  await searchUsers(searchQuery);
      console.log(response)
      if(response.length>0){
        setSearchResults(response);
      }
      else{
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Add a friend
  const handleAddFriend = async (friendId) => {
    try {
        console.log("add friend...",userId,friendId);
      await addFriends (userId,friendId);
      const newRoom =await createRoom("Friend Room",userId);
      await addUserToRoom(newRoom._id,friendId)
      setFriendStatus((prevStatus) => ({
        ...prevStatus,
        [friendId]: 'Friend added!',
      }));
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  return (
    <div>
      <h2>Find and Add Friends</h2>
      <input
        type="text"
        placeholder="Search by username or email"
        value={searchQuery}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Search</button>
     
      <ul>
        {searchResults.map((user) => (
          <li key={user.uid}>
            <p>{user.userName} ({user.email})</p>

            {friendStatus[user.uid] ? (
              <p>{friendStatus[user.uid]}</p>
            ) : (
              <button onClick={() => handleAddFriend(user.uid)}>
                Add Friend
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendManagement;
