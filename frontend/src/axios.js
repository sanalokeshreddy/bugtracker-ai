import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://bugtracker-back.onrender.com', // ✅ Render backend URL
});

export default instance;
