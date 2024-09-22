// src/services/roomService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL; // Replace with your server URL



export const searchUsers = async (searchQuery) => {
  const response = await axios.post(`${API_URL}/users/search?query=${searchQuery}`);
  return response.data;
};

export const getUserById = async (uid) => {
 
const response = await axios.get(`${API_URL}/users/${uid}`);
return response;
};

export const addFriends = async (userId, friendId) => {
 
  const response = await axios.post(`${API_URL}/users/addFriend`, { userId, friendId });
  return response;
  };



