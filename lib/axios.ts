import { showProductToast } from "@/store/ui/ui.slice";
import axios from "axios";
import { useDispatch } from "react-redux";

const api = axios.create({
    baseURL: "/api", // ✅ ALWAYS RELATIVE
    withCredentials: true,
});

api.interceptors.response.use(
    res => res,
    error => {
        const dispatch = useDispatch();

        dispatch(showProductToast({
            type: "error",
            name: "Something went wrong",
            image: "",
            message: error.response?.data?.message || "Server error"
        }));
        return Promise.reject(error);
    }
);

export default api;