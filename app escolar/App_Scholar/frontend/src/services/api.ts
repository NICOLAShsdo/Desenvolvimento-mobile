import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.20.10.7:3001'

});

export default api;
