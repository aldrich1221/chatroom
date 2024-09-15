// src/services/roomService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/rooms'; // Replace with your server URL

export const createRoom = async (name, userId) => {
  const response = await axios.post(`${API_URL}/create`, { name, userId });
  return response.data;
};

export const addUserToRoom = async (roomId, userId) => {
  const response = await axios.post(`${API_URL}/addUser`, { roomId, userId });
  return response.data;
};

export const removeUserFromRoom = async (roomId, userId) => {
  const response = await axios.post(`${API_URL}/removeUser`, { roomId, userId });
  return response.data;
};

export const deleteRoom = async (roomId) => {
  const response = await axios.delete(`${API_URL}/rooms/delete/${roomId}`);
  return response.data;
};

export const getUserRooms = async (userId) => {
  const response = await axios.get(`${API_URL}/userRooms/${userId}`);
  return response.data;
};
