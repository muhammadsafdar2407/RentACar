import { createContext, useEffect, useState } from "react";
import { toastError, toastSuccess } from "../Components/Toast/Toast";
import axiosInstance from "../Instance/instance";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || ""
  );

  const loginUser = async (data, subError, setSubError) => {
    try {
      // const response = await axios.post("http://localhost:5000/auth/login", data);
      const response = await axiosInstance.post("/auth/login", data);
      setUser(response.data);
      window.location.replace("/");
      // setTimeout(() => {
      //   window.location.replace("/");
      // }, 2000);
    } catch (err) {
      if (err.response.status === 422) {
        toastError("Invalid credentials");
        setSubError(err.response.data);
      } else {
        toastError("Something went wrong");
      }
    }
  };

  const logoutUser = async (data) => {
    // await axios.post('http://localhost:5000/auth/logout')
    try {
      // Attempt to log out on the server
      await axiosInstance.post("/auth/logout");
      
      // Clear the local user state and local storage
      setUser("");  // Use null instead of an empty string to avoid type issues
      localStorage.removeItem("user");
  
      // Redirect to login or home page after logout
      window.location.replace("/login"); // assuming you have a login page
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const getUpdatedUser = async () => {
    try {
      const res = await axiosInstance.get("/user/getUser");
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getUser = async () => {
    try {
      const res = await axiosInstance.get("/user/getUser");
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, loginUser, logoutUser, getUpdatedUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
