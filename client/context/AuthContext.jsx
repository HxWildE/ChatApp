import { createContext, useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({ baseURL: backendUrl });
/* eslint-disable react-refresh/only-export-components */
export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{

	const [token , setToken] = useState(localStorage.getItem("token"));
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
				toast.error(error.message);
			}
		}

		const login = async(state ,credentials) => {
			try {
				const { data } = await api.post(`/api/auth/${state}` , credentials);
				if(data.success){
					setAuthUser(data.userData);
					connectSocket(data.userData);
					setToken(data.token);
					localStorage.setItem("token" , data.token);
					toast.success(data.message);
				} else{
					toast.error(data.message);
				}
		} catch(error) {
			toast.error(error.message);
			}
		}

		const logout  = async () => {
			localStorage.removeItem("token");
			setToken(null);
			setAuthUser(null);
			setOnlineUsers([]);
			delete api.defaults.headers.common["token"];
			toast.success("Logged out Successfully");
			socket?.disconnect();
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
						query: {
							userId : userData._id,
						}
				});

				newSocket.connect();
				setSocket(newSocket);	

		newSocket.on("getOnlineUsers" , (userIds) =>{
			setOnlineUsers(userIds);
		})
	}

	useEffect (()=>{
			if(token){
				api.defaults.headers.common["token"] = token;
				// Auth check updates context state after the external request completes.
				// eslint-disable-next-line react-hooks/set-state-in-effect
				checkAuth();
			}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[token])

	
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