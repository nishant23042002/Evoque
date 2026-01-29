import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true, // 🔥 THIS IS REQUIRED
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
