import axios from 'axios';

instance = axios.create({
    baseURL: "http://localhost:5000/api",
});

export default instance;
