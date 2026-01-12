import toast from "react-hot-toast";
import apiClient from "../api/axiosClient.js";
import { setUser, setAccessToken, logoutUser } from "../redux/slices/authSlice";
// optional (only if you use redux-persist purge)
// import { persistor } from "../redux/store";

export const login = async ({ username, password, navigate, dispatch }) => {
    if (!username || !password) {
        toast.error("Please enter both username and password");
        return;
    }

    try {
        const response = await apiClient.post("/loginuser", {
            username,
            password,
        });

        const user = response?.data?.user;
        const accessToken = response?.data?.accessToken;
        if (user) dispatch(setUser(user));
        if (accessToken) dispatch(setAccessToken(accessToken));

        if (user) {
            toast.success("Login successful");
            navigate("/page", { replace: true });
        } else {
            toast.error("Login failed: user not received");
        }
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong when login");
        console.error("Login error:", error);
        throw error;
    }
};

export const UserCall = async () => {
    try {
        const response = await apiClient.get("/fetchUserDeatails");
        return response.data;
    } catch (e) {
        console.error("Error fetching user:", e);
        throw e;
    }
};

export const logout = async ({ dispatch, navigate }) => {
    try {
        await apiClient.get("/logout");

        // ✅ clear redux auth state
        dispatch(logoutUser());

        // ✅ purge persisted redux (optional)
        // await persistor.purge();

        toast.success("Logout successful");
        navigate("/login", { replace: true });
    } catch (e) {
        toast.error(e?.response?.data?.message || "Logout failed");
        console.error("Logout error:", e);
        throw e;
    }
};
