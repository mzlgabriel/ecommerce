import axios from 'axios';

const protocol = window.location.protocol;

const baseURL = protocol === 'https:' ? 'https://localhost:8000/api/' : 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: baseURL,
});

export default api;