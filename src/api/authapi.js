import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);
  return response.data;
};

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

const authApi = {
  login,
  register,
};

export default authApi;