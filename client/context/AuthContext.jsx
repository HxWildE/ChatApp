import { createContext, useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({ 
	baseURL: backendUrl,
	withCredentials: true // Important for sending/receiving HTTP-only cookies
});

/* eslint-disable react-refresh/only-export-components */
export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{

	const [authUser , setAuthUser ] = useState(null);
	const [onlineUsers , setOnlineUsers] = useState([]);
	const [socket , setSocket] = useState(null);

	const checkAuth = async () =>{
		try{
			const { data } = await api.get("/api/auth/check"); 
			if(data.success){
				setAuthUser(data.user);
				connectSocket(data.user);
			}
		} catch(error) {
			console.log("Not authenticated", error.message);
		}
	}

	const login = async(state ,credentials) => {
		try {
			const { data } = await api.post(`/api/auth/${state}` , credentials);
			if(data.success){
				setAuthUser(data.userData);
				connectSocket(data.userData);
				toast.success(data.message);
			} else{
				toast.error(data.message);
			}
		} catch(error) {
			toast.error(error.message);
		}
	}

	const logout = async () => {
		try {
			await api.post("/api/auth/logout");
			setAuthUser(null);
			setOnlineUsers([]);
			toast.success("Logged out Successfully");
			socket?.disconnect();
		} catch (error) {
			toast.error("Logout failed: " + error.message);
		}
	}

	const updateProfile = async (body) => {
		try {
			const { data } = await api.put("/api/auth/update-profile", body);
			if (data.success) {
				setAuthUser(data.user);
				toast.success(data.message || "Profile updated successfully");
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
		}
	}

	const connectSocket = (userData) => {
		if(!userData || socket?.connected) return;
		
		const newSocket = io(backendUrl ,{
			withCredentials: true
		});

		newSocket.connect();
		setSocket(newSocket);	

		newSocket.on("getOnlineUsers" , (userIds) =>{
			setOnlineUsers(userIds);
		})
	}

	useEffect (()=>{
		// Automatically check auth status using the HTTP-only cookie on mount
		checkAuth();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	
	const value = {
		axios: api, 
		authUser,
		onlineUsers,
		socket,
		login,
		logout,
		updateProfile
	}

	return (
		<AuthContext.Provider value={value}>
			{ children }
		</AuthContext.Provider>
	)

}