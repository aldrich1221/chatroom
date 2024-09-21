import React, { useState ,useRef} from 'react';
import { searchUsers, addFriends } from '../../Services/UserService';
import { createRoom, addUserToRoom } from '../../Services/RoomService';
import {
Search
} from "@chatscope/chat-ui-kit-react";
const FriendManagement = ({ userId, handleRefreshTrigger, friends }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendStatus, setFriendStatus] = useState({});

  // const searchRef = useRef<HTMLInputElement>(null);
  // const setFocus = () => searchRef.current?.focus();
  const [value, setValue] = useState("please type");
  // Handle search input change
  const handleInputChange = (e) => {
    // setSearchQuery(e.target.value);
    setValue(e.target.value)
  };

  // Search users by username or email
  const handleSearch = async () => {
    try {
      console.log(" handleSearch",value)
      const response = await searchUsers(value);
      setSearchResults(response.length > 0 ? response : []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Add a friend
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
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <hr/>
      {/* <h2 className="text-2xl font-semibold mb-4">Friends</h2> */}
      <input
        type="text"
        placeholder="Search by username or email"
        value={value}
        onChange={handleInputChange}
        className="border border-gray-300 rounded-md p-2 mb-4 w-full"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
      >
        Search
      </button>
 

      <ul className="mt-4">
        {searchResults.map((user) => (
          <div key={user.uid} className="mt-4">
            <div className="container">
              <div className="card shadow-sm">
                <div className="card-body">
                  <p className="card-text">
                    <strong>Name:</strong> {user.userName}
                  </p>
                  <p className="card-text">
                    <strong>Email:</strong> {user.email}
                  </p>
                </div>
                <div className="p-2">
                  {friends.includes(user.uid) ? (
                    <p className="bg-green-500 p-2 hover:bg-green-600" >Already Friends</p>
                  ) : (
                    <button
                      onClick={() => handleAddFriend(user.uid)}
                      className="bg-green-500 text-white rounded-md p-2 hover:bg-green-600"
                    >
                      Add Friend
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default FriendManagement;
